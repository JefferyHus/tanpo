import { Injector } from '@/core/classes/container/decorators/injector.decorator';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Injector({
  dependencies: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
