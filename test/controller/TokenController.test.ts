import 'reflect-metadata';
import request from 'supertest';
import redisMock from 'redis-mock';
import { iocContainer } from '../../src/applicationSetup/iocContainer';
import { startTestService } from '../__setup__/testServer';
import { CommonEnum } from '../../src/enum/CommonEnum';
import { User } from '../__fixtures__/User.fixtures';

let accessToken;

describe(' Test Token Controller', () => {
  let app: any;
  beforeAll(async () => {
    jest.mock('redis', () => redisMock);
    /* Connecting to the database and server before each test. */
    app = await startTestService(iocContainer);
  });

  afterEach(async () => {   
    jest.resetAllMocks();
  });

  describe('Test /token Api', () => {
    describe('happy path', () => {
      it('should return token when params are passed', async () => {
        const res = await request(app)
          .post('/token')
          .send(User)
          .set('Content-Type', 'application/json');

        const { token } = res.body;
        accessToken = token.accessToken;

        expect(accessToken).not.toBeNull();
      });
    });
    describe('negative path', () => {
      it('should throw error when params are invalid', async () => {
        const res = await request(app)
          .post('/token')
          .send({ password: 'admin123' })
          .set('Content-Type', 'application/json');

        const { reason } = res.body;
        expect(reason).toEqual(CommonEnum.INVALID_PARAMS);
      });
    });

    describe('Test /renew Api', () => {
      describe('happy path', () => {
        it('should return new access token when valid Refresh token is passed', async () => {
          const res = await request(app)
            .post('/token')
            .send(User)
            .set('Content-Type', 'application/json');

          const cookie = res.headers['set-cookie'][0];
          const response = await request(app).post('/token/renew').set('Cookie', cookie);
          const { token } = response.body;
          accessToken = token.accessToken;

          expect(accessToken).not.toBeNull();
          expect(response.status).toEqual(200);
        });
      });

      describe('negative path', () => {
        it('should throw error when no refresh token is passed in cookie ', async () => {
          const response2 = await request(app).post('/token/renew');
          expect(response2.status).toEqual(500);
          expect(response2.body.reason).toEqual(CommonEnum.NO_REFRESH_TOKEN_FOUND);
        });

        it('should throw error when invalid refresh token is passed in cookie ', async () => {
          const response = await request(app).post('/token/renew').set('Cookie', 'random_test');
          expect(response.status).toEqual(500);
          expect(response.body.reason).toEqual(CommonEnum.NO_REFRESH_TOKEN_FOUND);
        });
      });
    });
  });
});
