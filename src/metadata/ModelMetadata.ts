"use strict";
import { Model } from 'mongoose'
/**
 * Model metadata used to storage information about registered controller.
 */
export interface ModelMetadata {
  /**
   * Indicates object which is used by this model.
   */
  object: any;
  /**
   * Instance of the object that is used to call model methods on.
   */
  instance?: Object;
}
