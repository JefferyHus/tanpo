import { Profile } from '@prisma/client';
import { Service } from 'typedi';

import { ProfileRepository } from './profile.repository';

@Service()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async getCurrentProfile(userId: string) {
    const profile = this.profileRepository.findOneByUserId(userId);

    // if the user doesn't have a profile, ask them to create one
    if (!profile) {
      throw new Error('You need to create a profile');
    }

    return profile;
  }

  public async createProfile(
    userId: string,
    data: Partial<Profile>,
  ): Promise<Profile> {
    const profile = await this.profileRepository.create({
      ...data,
      userId,
    });

    return profile;
  }

  public async updateProfile(
    userId: string,
    data: Partial<Profile>,
  ): Promise<Profile> {
    const profile = await this.profileRepository.update(
      {
        userId,
      },
      data,
    );

    return profile;
  }
}
