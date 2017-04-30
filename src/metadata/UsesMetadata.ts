export interface UsesMetadata {
  /**
   * middleware's main body, constr or a inst's method
   */
  object: any;
  /**
   * the method which decorate on
   */
  methodName: string;
  /**
   * before or after handler
   */
  type: string;

  middlewares: Function[];
}

export class UsesType {
  static BEFORE = 'BEFORE'
  static AFTER = 'AFTER'
}