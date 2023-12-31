import { Injector } from '@/core/classes/container/decorators/injector.decorator';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Injector({
  dependencies: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
