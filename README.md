# Express-Jwt Authorization
## Rest API using express, redis and JWT to authorize users

#### readme - https://github.com/iamksuresh/express-jwt-authentication#readme

#### screenshots
-   Folder structure - ![folder structure](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/folder_structure.png)


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

#### Note : Please replace the .env content with values provided in mail

## Technology stack
-   Express js , Typescript, Redis, Jsonwebtokens, Inversify (IOC) , 
-   supertest, redis-mock
-   Reflect-metadata : JS metadata / proxies
-   prettier, Eslint

## Installation
-  Pre-requisite - [Node.js](https://nodejs.org/) latest. 
-  git clone git@github.com:iamksuresh/express-jwt-authentication.git
-  Tested in node 16.15.0 , npm 8.9.0 , 

```sh
cd <root-folder>
npm i
npm start
```
- Server will start at port 3000

## Testing
-   Super test for API integration test
```sh
cd <root-folder>
npm i (if not already done)
npm test
```
![Test coverage](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/test-coverage.png)

###  JWT Implementation and testing strategy 
- Redis is mocked and separate Express instance is loaded
- All test cases are executed in this instance
- /token
    - mock username,password is passed as params
    - for these params, using keys from .env, jwt Access and Refresh tokens are generated
    - Access token is returned in response
    - Refresh token is returned as httponly cookie
    - Both access token and refresh token are stored in Redis
- /token/renew
    - we need to set refresh token from /token api to Cookie headers
    - For valid refresh headers, new Access token is passed
    - Error scenarios like - invalid token, no cookie are handled
- /about
    - add access token in header.authorization as - 
    ``set('Authorization', 'Bearer ' + accessToken) ``
- Json web tokens
    - It is used as middleware for `/about` path
    - uses `verify()` to check for valid access token
### Improvements

Though token is one of the most preferred way of implementing authorization in http(s), few options can be considered to improve JWT implementation
-  Rotating Refresh token - update refresh token with every access token renewal
-  Passing Refresh token as httponly cookie and restricting it to specific path (/token/renew)
-  Having better CORS policy
-  To have better redis implementation

## Postman collection
- Access Postman collection here -  https://github.com/iamksuresh/express-jwt-authentication/tree/main/postman-collection

### Screenshots

![refresh token](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/httponly-refresh-token-cookie.png)
![/token](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/token-api.png)
