import { userModel } from './models/userModel';

export interface IUserRepository {
  getUser(username: string): userModel;
}
