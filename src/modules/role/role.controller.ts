import { Service } from 'typedi';

import { Controller } from '@/core/decorators/controller.decorator';
import { Get } from '@/core/decorators/routers';

import { RoleService } from './role.service';

@Service()
@Controller('/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  public async get() {
    return 'Hello World!';
  }
}
