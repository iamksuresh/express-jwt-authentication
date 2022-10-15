import 'reflect-metadata';
import request from 'supertest';
import redisMock from 'redis-mock';
import { iocContainer } from '../../src/applicationSetup/iocContainer';
import { startTestService } from '../__setup__/testServer';
import { CommonEnum } from '../../src/enum/CommonEnum';
import { User } from '../__fixtures__/User.fixtures';


let accessToken ;
describe(' Test /about API', () => {
  let app: any;
  beforeAll(async () => {
    jest.mock('redis', () => redisMock);
    /* Connecting to the database and server before each test. */
    app = await startTestService(iocContainer);
  });

  afterEach(async () => {
    /* Closing database connection after each test. */
    jest.resetAllMocks();
  });

  describe('happy path', () => {
    it('should return hello world when valid access token is available', async () => {
      const res = await request(app)
        .post('/token')
        .send(User)
        .set('Content-Type', 'application/json');

      // console.log('===res ', res.body, res.headers['set-cookie'][0]);
      const {token} = res.body;
      accessToken = token.accessToken;

     const response =  await request(app)
      .get('/about')
      .set('Authorization', 'Bearer ' + accessToken) 

      expect(response.text).toEqual(CommonEnum.HELLO_WORLD)
      expect(response.status).toEqual(200)
    });

    it('should return 401 when access token is invalid ', async () => {
        
  
       const response =  await request(app)
        .get('/about')
         
  
        expect(response.status).toEqual(401)
      });

  });
});
