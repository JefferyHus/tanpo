import { Injector } from './core/classes/container/decorators/injector.decorator';
import { AuthModule } from './modules/authentication/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

@Injector({
  dependencies: [AuthModule, ProfileModule],
})
export class AppModule {}
