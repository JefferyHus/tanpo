import { Router } from 'express';

import { IController } from './controller.interface';

export abstract class BaseController implements IController {
  public router: IController['router'] = Router();
  public path: IController['path'] = '/';
}
