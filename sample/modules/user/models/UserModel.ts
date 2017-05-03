'use strict';
import { Domain } from '../../../../src';

export interface IUser {
  user: string
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
