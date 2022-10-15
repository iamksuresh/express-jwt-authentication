# Express-Jwt Authorization
## Rest API using express, redis and JWT to authorize users

#### readme -

#### screenshots
-   Folder structure - 


## Features
- Express based Rest API service written in Typescript
- Redis to store Refresh, access JWT tokens
- 3 layered architecture with clear separation of business and Repository logics
- IOC containers for module injection
- Using simple pre-defined annotations to register controllers

## Good to know - for Assigment purpose only
-   User DB is mocked and only username is validated for assigning new access tokens
-   API - /token/ - on successful token creation, it will return Access token in response.
--  Refresh token is added in response [set-cookie] header
-- Use refresh token from above, for token renewal on expiry
-  Token secrets and expiry are in .env file (pushed for assignment purpose only)

#### Note : Redislabs url is shared separately in mail. Please add it in .env file `REDIS_URL`

## Technology stack
-   Express js , Typescript, Redis, Jsonwebtokens, Inversify (IOC)
-   Reflect-metadata : JS metadata / proxies

## Testing
-   Super test for API integration test


## Installation
-  Pre-requisite - [Node.js](https://nodejs.org/) latest. 
-  git clone 
-  Tested in node 16.15.0 , npm 8.9.0 , 

```sh
cd <root-folder>
npm i
npm start
```
- Server will start at port 3000


## Testing
```sh
cd <root-folder>
npm i (if not already done)
npm test
```
## Postman collection
- Access Postman collection here - 

