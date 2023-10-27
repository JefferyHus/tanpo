import { Injector } from './core/classes/container/decorators/injector.decorator';
import { ProfileModule } from './modules/profile/profile.module';


@Injector({
  dependencies: [
    ProfileModule,
  ]
})
export class AppModule {}
