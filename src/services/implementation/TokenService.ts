import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import {
  BaseService,
  commonServiceTypes,
  IConfigService,
  ILogService,
} from '../../applicationSetup';
import { LogType } from '../../applicationSetup/services/ILogService';
import { tokenDto } from '../dto/tokenDto';
import { ITokenService } from '../ITokenService';
import { types as repoTypes } from '../../repositories/types';
import { IUserRepository } from '../../repositories/IUserRepository';
import { userModel } from '../../repositories/models/userModel';
import { IRedisService } from '../../applicationSetup';
import { MessageEnum } from '../../enum/MessageEnum';
import { CommonEnum } from '../../enum/CommonEnum';

@injectable()
export class TokenService extends BaseService implements ITokenService {
  @inject(commonServiceTypes.ILogService)
  private readonly _logservice: ILogService;

  @inject(commonServiceTypes.IConfigService)
  private readonly _configService: IConfigService;

  @inject(repoTypes.IUserRepository)
  private readonly _userReposiroty: IUserRepository;

  @inject(commonServiceTypes.IRedisService)
  private readonly _redisService: IRedisService;

  private readonly _accessTokenSecret = 'ACCESS_TOKEN_SECRET';
  private readonly _refreshTokenSecret = 'REFRESH_TOKEN_SECRET';
  private readonly _accessTokenExpiry = 'ACCESS_TOKEN_EXPIRY';
  private readonly _refreshTokenExpiry = 'REFRESH_TOKEN_EXPIRY';

  getDtoClass() {
    return tokenDto;
  }

  generateToken = async (username: string, password: string): Promise<tokenDto> => {
    this._logservice.log(LogType.Info, `generating token for ${username}`);
    // check if user exists
    const dbUser = await this._userReposiroty.getUser(username);

    // generate tokens
    const accessToken = this._createToken(dbUser, this._accessTokenSecret, this._accessTokenExpiry);
    const refreshToken = this._createToken(
      dbUser,
      this._refreshTokenSecret,
      this._refreshTokenExpiry,
    );

    let tokenObj = this._toDto(accessToken, refreshToken);
    // Save token in redis
    await this._saveTokenInStore(tokenObj, dbUser);
    return tokenObj;
  };

  renewToken = async (refreshToken: string): Promise<tokenDto | void> => {
    // Verifying refresh token
    let tokenObj = jwt.verify(
      refreshToken,
      this._configService.getByKey(this._refreshTokenSecret),
      async (err: any) => {
        if (err) {
          throw { reason: MessageEnum.INVALID_REFRESH_TOKEN };
        } else {
          const redisRefreshToken = await this._redisService.get(
            CommonEnum.REDIS_REFRESH_TOKEN_KEY,
          );
          if (redisRefreshToken) {
            const { dbUser } = redisRefreshToken[refreshToken];
            const newAccessToken = this._createToken(
              dbUser,
              this._accessTokenSecret,
              this._accessTokenExpiry,
            );

            let newDto = this._toDto(newAccessToken, refreshToken);
            await this._saveTokenInStore(newDto, dbUser);
            return newDto;
          } else {
            throw { reason: MessageEnum.TOKEN_NOT_IN_DB };
          }
        }
      },
    );

    return tokenObj;
  };

  private _createToken = (dbUser: userModel, secretKey: string, expiryKey: string): string => {
    return jwt.sign(
      {
        username: dbUser.username,
        password: dbUser.password,
      },
      this._configService.getByKey(secretKey),
      {
        expiresIn: this._configService.getByKey(expiryKey),
      },
    );
  };

  private _saveTokenInStore = async (value: tokenDto, dbUser: userModel) => {
    const { accessToken, refreshToken } = value.token;

    const redisRefreshToken = await this._redisService.get(CommonEnum.REDIS_REFRESH_TOKEN_KEY);
    if (redisRefreshToken) {
      await this._redisService.set(CommonEnum.REDIS_REFRESH_TOKEN_KEY, {
        ...redisRefreshToken,
        [refreshToken]: { accessToken, dbUser },
      });
    } else {
      await this._redisService.set(CommonEnum.REDIS_REFRESH_TOKEN_KEY, {
        [refreshToken]: { accessToken, dbUser },
      });
    }
  };

  private _toDto = (accessToken: string, refreshToken: string): tokenDto => ({
    token: {
      accessToken,
      refreshToken,
    },
  });
}
