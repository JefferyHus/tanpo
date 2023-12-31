import { Injector } from '@/core/classes/container/decorators/injector.decorator';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Injector({
  dependencies: [UserService],
  controllers: [UserController],
})
export class UserModule {}
