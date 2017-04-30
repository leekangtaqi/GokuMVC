import baseCfg from './config.base'
import props from '../properties'
import * as _ from 'lodash'

let env = process.env
let suffix = env === props.env.QA ? 'qa' : env === props.env.PRD ? 'prd' : 'dev'
let toMergeCfg = require(`./config.${suffix}.ts`).default

interface IConfig {
  port?: number,
  mongo?: any
}

class Config implements IConfig {
  port: number;
  mongo: any;
  constructor(config: IConfig) {
    this.port = config.port
    this.mongo = config.mongo
  }
}

export default new Config(_.merge({}, baseCfg, toMergeCfg));