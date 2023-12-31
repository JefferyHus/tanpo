import { Prisma, User } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { JWT_SECRET, USER_SERVICE_ERRORS } from '@/constants';
import { TokenizedResponse } from '@/core/types/generic.types';
import { UserRepository } from '@/modules/user/user.repository';
import { RedisFactory } from '@/redis.factory';

import { UserWithRelations } from '../user/user.types';
@Service()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  private async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<UserWithRelations<'role'>> {
    if (!data.email) {
      throw new Error('Email is required');
    }

    // check if the user already exists
    const user = await this.userRepository.findOneByEmail({
      email: data.email,
    });

    if (user) {
      throw new Error('user already exists');
    }

    // create a hash of the password
    const hash = crypto.createHash('sha256');

    // hash the password
    data.password = hash.update(data.password, 'utf8').digest('hex');

    return this.userRepository.create(data);
  }

  private async verifyUser(
    email: string,
    password: string,
  ): Promise<UserWithRelations<'role'>> {
    // find the user by email
    const user = await this.userRepository.findOneWithRoleByEmail({ email });

    if (!user) {
      throw new Error(USER_SERVICE_ERRORS.NOT_FOUND);
    }

    // create a hash of the password
    const hash = crypto.createHash('sha256');

    // hash the password
    password = hash.update(password, 'utf8').digest('hex');

    // compare the password
    if (password !== user.password) {
      throw new Error(USER_SERVICE_ERRORS.INVALID_PASSWORD);
    }

    return user;
  }

  private async createAccessToken(
    user: UserWithRelations<'role'>,
  ): Promise<TokenizedResponse> {
    // if the password is correct, create a new jwt token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    // set the redis key to the refresh token
    await RedisFactory.client.set(`refreshToken:${user.id}`, refreshToken);

    return {
      userId: user.id,
      token,
      refreshToken,
    };
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<UserWithRelations<'role'> | null> {
    // verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id: string;
    };

    if (!decoded) {
      return null;
    }

    // get the user id from the decoded token
    const userId = decoded.id;

    // get the refresh token from redis
    const redisRefreshToken = await RedisFactory.client.get(
      `refreshToken:${userId}`,
    );

    // compare the refresh tokens
    if (refreshToken !== redisRefreshToken) {
      return null;
    }

    // get the user by id
    return this.userRepository.findUniqueWithRole({ id: userId });
  }

  private async verifyAccessToken(accessToken: string): Promise<User | null> {
    // verify the access token
    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      id: string;
    };

    if (!decoded) {
      return null;
    }

    // get the user id from the decoded token
    const userId = decoded.id;

    // get the user by id
    return this.userRepository.findUnique({ id: userId });
  }

  private async deleteRefreshToken(refreshToken: string): Promise<void> {
    // verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id: number;
    };

    if (!decoded) {
      throw new Error(USER_SERVICE_ERRORS.INVALID_REFRESH_TOKEN);
    }

    // get the user id from the decoded token
    const userId = decoded.id;

    // delete the refresh token from redis
    await RedisFactory.client.del(`refreshToken:${userId}`);
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenizedResponse> {
    // verify the refresh token
    const user = await this.verifyRefreshToken(refreshToken);

    if (!user) {
      throw new Error(USER_SERVICE_ERRORS.INVALID_REFRESH_TOKEN);
    }

    // if the refresh token is valid, create a new jwt token
    const { token, refreshToken: newRefreshToken } =
      await this.createAccessToken(user);

    return {
      userId: user.id,
      token,
      refreshToken: newRefreshToken,
    };
  }

  async login(email: string, password: string): Promise<TokenizedResponse> {
    // verify the user
    const user = await this.verifyUser(email, password);

    // create a new access token
    const { token, refreshToken } = await this.createAccessToken(user);

    return {
      userId: user.id,
      token,
      refreshToken,
    };
  }

  async register(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<TokenizedResponse> {
    // create the user
    const user = await this.createUser(data);

    // create a new access token
    const { token, refreshToken } = await this.createAccessToken(user);

    return {
      userId: user.id,
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenizedResponse> {
    // verify the refresh token
    const user = await this.verifyRefreshToken(refreshToken);

    if (!user) {
      throw new Error(USER_SERVICE_ERRORS.INVALID_REFRESH_TOKEN);
    }

    // if the refresh token is valid, create a new jwt token
    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    // set the redis key to the refresh token
    await RedisFactory.client.set(`refreshToken:${user.id}`, newRefreshToken);

    return {
      userId: user.id,
      token,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // delete the refresh token from redis
    await this.deleteRefreshToken(refreshToken);
  }
}
