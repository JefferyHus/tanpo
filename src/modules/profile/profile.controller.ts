import { Request, Response } from 'express-serve-static-core';
import { Service } from 'typedi';

import { Controller } from '@/core/decorators/controller.decorator';
import { Documentation } from '@/core/decorators/documentation.decorator';
import { Middleware } from '@/core/decorators/middleware.decorator';
import { Get } from '@/core/decorators/routers';
import { JWTAuthenticated } from '@/middlewares/authenticated';

import {
  ProfileGetDocumentation,
  ProfileUpdateDocumentation,
  ProfileUpdateRequest,
} from './profile.schema';
import { ProfileService } from './profile.service';

@Service()
@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/get')
  @Middleware(JWTAuthenticated())
  @Documentation(ProfileGetDocumentation)
  public async get(request: Request, response: Response) {
    const profile = await this.profileService.getCurrentProfile(
      String(request.user.id),
    );

    return response.json({
      message: 'Profile retrieved successfully',
      profile,
    });
  }

  @Get('/update')
  @Middleware(JWTAuthenticated())
  @Documentation(ProfileUpdateDocumentation)
  public async update(request: ProfileUpdateRequest, response: Response) {
    const profile = await this.profileService.updateProfile(
      String(request.user.id),
      request.body,
    );

    return response.json({
      message: 'Profile retrieved successfully',
      profile,
    });
  }
}
