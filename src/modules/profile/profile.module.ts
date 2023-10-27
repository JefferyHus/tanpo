import { Injector } from '@/core/classes/container/decorators/injector.decorator';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Injector({
  dependencies: [ProfileService],
  controllers: [ProfileController],
})

export class ProfileModule {}
