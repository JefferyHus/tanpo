import { Injector } from '@/core/classes/container/decorators/injector.decorator';

import { AuthController } from './auth.controller';

@Injector({
  dependencies: [],
  controllers: [AuthController],
})
export class AuthModule {}
