// const express = require('express')
import express from 'express';
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { iocContainer } from './applicationSetup/iocContainer';
import { App } from './app';

const app = express();

const initServer = async () => {
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(cookieParser());
  app.use(
    bodyParser.urlencoded({
      limit: '200mb',
      extended: true,
      parameterLimit: 1000000,
    }),
  );
};

const setUpIoc = () => new App(app, iocContainer);

(async () => {
  try {
    // init express server
    await initServer();
    const appInstance = setUpIoc();

    // init external services , initialise IOC's
    appInstance
      .initExternal()
      .then(async (expressApp: any) => {
        return appInstance.run(expressApp);
      })
      .then(() => {
        // db init
      })
      .then(() => {
        const port = process.env.NODE_PORT || 8080;
        console.log('== port ', port);
        app.listen(port);
        return app;
      });
  } catch (e) {
    console.log('error in Server setup ', e);
  }
})();
