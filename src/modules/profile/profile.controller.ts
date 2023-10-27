import { Controller } from '@/core/decorators/controller.decorator';
import { Get } from '@/core/decorators/routers';
import { ProfileService } from './profile.service';
import { Service } from 'typedi';
import { Documentation } from '@/core/decorators/documentation.decorator';
import { ProfileGetDocumentation } from './profile.schema';
import { Request, Response } from 'express-serve-static-core';

@Service()
@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/get')
  @Documentation(ProfileGetDocumentation)
  public async get(request: Request, response: Response) {
    return response.json({ message: 'Hello world' });
  }
}
