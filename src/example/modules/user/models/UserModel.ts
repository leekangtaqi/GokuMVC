'use strict';
import { Domain } from '../../../../Decorators';

export interface IUser {
  username: string
}

@Domain()
class User {
  username = {
    type: String
  }
  options = {
    timestamps: true
  }
}
