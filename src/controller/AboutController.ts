import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  commonServiceTypes,
  Controller,
  ControllerAction,
  ExpressMiddleware,
  HttpMethodEnum,
  ILogService,
  Name,
} from '../applicationSetup';
import { CommonEnum } from '../enum/CommonEnum';
import AuthMiddleWare from '../middleware/AuthMiddleWare';
import { BaseController } from './BaseController';

@injectable()
@ExpressMiddleware(AuthMiddleWare)
@Controller('/about')
export class AboutController extends BaseController {
  @inject(commonServiceTypes.ILogService)
  private readonly _logservice: ILogService;

  @ControllerAction({ method: HttpMethodEnum.Get, path: '/' })
  @Name('about')
  async aboutController(req: Request, res: Response) {
    this._logservice.info('About endpoint is called');
    return res.send(CommonEnum.HELLO_WORLD);
  }
}
