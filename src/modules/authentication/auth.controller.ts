import { Request, Response } from 'express-serve-static-core';
import { Service } from 'typedi';

import { HTTP_STATUS_CODES } from '@/constants';
import { Controller } from '@/core/decorators/controller.decorator';
import { Documentation } from '@/core/decorators/documentation.decorator';
import { Middleware } from '@/core/decorators/middleware.decorator';
import { Post } from '@/core/decorators/routers';
import { JWTAuthenticated } from '@/middlewares/authenticated';
import { SchemaValidation } from '@/middlewares/schema.validation';

import { UserService } from '../user/user.service';
import {
  AuthLoginDocumentation,
  AuthLoginRequest,
  AuthRefreshTokenDocumentation,
  AuthRegisterDocumentation,
  AuthRegisterRequest,
  AuthSchema,
} from './auth.schema';
import { AuthService } from './auth.service';

@Service()
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  @Middleware(SchemaValidation(AuthSchema))
  @Documentation(AuthRegisterDocumentation)
  async register(request: AuthRegisterRequest, response: Response) {
    const { body } = request;

    // create the user
    const { token } = await this.authService.register({
      email: body.email,
      password: body.password,
    });

    // redirect to the login page
    return response.status(HTTP_STATUS_CODES.CREATED).json({
      token,
    });
  }

  @Post('/login')
  @Documentation(AuthLoginDocumentation)
  async login(request: AuthLoginRequest, response: Response) {
    const { email, password } = request.body;

    // verify the user
    const { token } = await this.authService.login(email, password);

    return response.status(HTTP_STATUS_CODES.OK).send({
      token,
    });
  }

  @Post('/refresh-token')
  @Middleware(JWTAuthenticated())
  @Documentation(AuthRefreshTokenDocumentation)
  async refresh(request: Request, response: Response) {
    // get the refresh token from the request
    const { refresh } = request.token;

    // refresh the token
    const { token } = await this.authService.refreshAccessToken(refresh);

    return response.status(HTTP_STATUS_CODES.OK).send({
      token,
    });
  }
}
