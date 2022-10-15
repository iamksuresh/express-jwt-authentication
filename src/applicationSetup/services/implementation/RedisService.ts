import { injectable } from 'inversify';
import { createClient } from 'redis';
import { IRedisService } from '../IRedisService';

@injectable()
export class RedisService implements IRedisService {
  private readonly _redisclient = createClient({
    url: process.env.REDIS_URL,
  });

  constructor() {
    this._redisclient.on('error', (err) => console.log('Redis Client Error', err));
    this._redisclient.connect().then((val) => console.log('== Redis connected Successful =='));
  }

  set = async (key: string, value: any): Promise<any> => {
    return this._redisclient.set(key, JSON.stringify(value));
  };

  get = async (key: string): Promise<any> => {
    let value = await this._redisclient.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  };

  accessRedisClient = () => this._redisclient;
}
