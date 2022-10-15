import 'reflect-metadata';
import express from 'express';
import * as bodyParser from 'body-parser';
import { Container } from 'inversify';
import cookieParser from 'cookie-parser';
import { App } from '../../src/app';

let app: any;
export async function startTestService(iocContainer: Container) {
  if (app === undefined) {
    app = express();
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(cookieParser());
    app.use(
      bodyParser.urlencoded({
        limit: '200mb',
        extended: true,
        parameterLimit: 1000000,
      }),
    );
    const appInstance = new App(app, iocContainer);
   
    await appInstance.initExternal();
    await appInstance.run(app);
  }
  return app;
}
