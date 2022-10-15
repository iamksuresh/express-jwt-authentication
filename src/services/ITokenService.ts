import { tokenDto } from "./dto/tokenDto";

export interface ITokenService {
  generateToken(username: string, password: string): Promise<tokenDto>;
  renewToken(refreshToken : string) : Promise<any>;
}
