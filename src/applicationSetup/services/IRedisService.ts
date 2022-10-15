export interface IRedisService {
  set(key: string, value: any): Promise<any>;
  get(key: string): Promise<any>;
  accessRedisClient(): any;
}
