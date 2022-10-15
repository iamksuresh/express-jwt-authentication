import { Container } from "inversify";
import { TokenService } from "./implementation/TokenService";
import { ITokenService } from "./ITokenService";
import { types as appServiceTypes } from "./types";

export async function configureServices(
  container: Container
): Promise<Container> {
  container
    .bind<ITokenService>(appServiceTypes.ITokenService)
    .to(TokenService);

  return container;
}
