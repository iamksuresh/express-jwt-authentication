import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import {
  commonServiceTypes,
  Controller,
  ControllerAction,
  HttpMethodEnum,
  ILogService,
  Name,
  ValidateRequestParams,
} from '../applicationSetup';
import { BaseController } from './BaseController';
import { TokenVM } from './viewModel/TokenVM';
import { types as serviceTypes } from '../services/types';
import { ITokenService } from '../services/ITokenService';

@injectable()
@Controller('/token')
export class TokenController extends BaseController {
  @inject(commonServiceTypes.ILogService)
  private readonly _logservice: ILogService;

  @inject(serviceTypes.ITokenService)
  private readonly _tokenService: ITokenService;

  @ControllerAction({ method: HttpMethodEnum.Post, path: '/' })
  @Name('token')
  @ValidateRequestParams(TokenVM)
  async generateTokenController(req: Request, res: Response) {
    const { username, password } = this.params(req);
    if (!username || !password) this.throwError({ reason: 'Invalid params' });
    this._logservice.info(`token api called`);
    const { token } = await this._tokenService.generateToken(username, password);
    this._setHttpOnlyCookie(token.refreshToken, res);
    return {
      token: { accessToken: token.accessToken },
    };
  }

  @ControllerAction({ method: HttpMethodEnum.Post, path: '/renew' })
  @Name('renew')
  async renewTokenController(req: Request, res: Response) {
    const cookies = this.cookie(req);

    if (!cookies?.jwt) this.throwError({ reason: 'No Refresh token found in cookie' });
    // Destructuring refreshToken from cookie
    const refreshToken = cookies.jwt;
    const { token } = await this._tokenService.renewToken(refreshToken);

    return {
      token: { accessToken: token.accessToken },
    };
  }

  private _setHttpOnlyCookie = (refreshToken: string, res: Response) => {
    // Assigning refresh token in http-only cookie
    this._logservice.info('assigning httpOnly refreshToken');
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/token/renew',
    });
  };
}
