import { Service } from 'typedi';

import { Controller } from '@/core/decorators/controller.decorator';
import { Get } from '@/core/decorators/routers';

import { UserService } from './user.service';

@Service()
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  public async get() {
    return 'Hello World!';
  }
}
