import express from "express";

import { registerController } from "./applicationSetup";
import { ApplicationBase } from "./applicationSetup/ApplicationBase";
import { iocContainer } from "./applicationSetup/iocContainer";
import { AboutController } from "./controller/AboutController";
import { TokenController } from "./controller/TokenController";
import { configureRepositories } from "./repositories/ioc";
import { configureServices } from "./services/ioc";

export class App extends ApplicationBase {
  async setupIoC(
    expressApp: express.Application
  ): Promise<express.Application> {
    await configureRepositories(iocContainer);
    await configureServices(iocContainer);
    registerController(TokenController, AboutController);
    return expressApp;
  }
}
