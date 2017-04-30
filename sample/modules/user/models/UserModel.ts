'use strict';

import * as mongoose from 'mongoose';
import { Domain } from '../../../../src';

export interface IUser {
  user: string
}

let Schema: any = mongoose.Schema

@Domain()
class User {
  username = {
    type: String
  }
  options = {
    timestamps: true
  }
}
