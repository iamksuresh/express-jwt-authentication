import { injectable } from 'inversify';
import { IUserRepository } from '../IUserRepository';

import { MessageEnum } from '../../enum/MessageEnum';
import { userModel } from '../models/userModel';
import { MockUserDB } from '../../db/userDB';

@injectable()
export class UserRepository implements IUserRepository {
  getUser = (username: string): userModel => {
    /**
     * Mock method for assignment purpose only.
     * In production, it should call User table to check if user exists
     */

    if (MockUserDB.username === username) {
      return MockUserDB;
    }
    throw {reason : MessageEnum.NO_USER_FOUND};
  };
}
