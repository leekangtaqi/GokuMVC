export interface IApplicationContext {
  models: any;
  services: any;
}
export default class ApplicationContext implements IApplicationContext {
  models: any = {};
  services: any = {};
}