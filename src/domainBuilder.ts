import ApplicationContext, { IApplicationContext } from './context'
import { ModelMetadata } from './metadata/ModelMetadata'
import * as mongoose from 'mongoose'

export default class DomainBuilder {
  static reservedProps = ['options', 'methods', 'staticMethods', 'invocations']

  constructor(private applicationContext: IApplicationContext){}
  
  build(metadata: ModelMetadata): void {
    let originSchemaMetadata = new metadata.object()
    let { options, methods, staticMethods, invocations } = this.extractRules(originSchemaMetadata)
    let schema: any = new mongoose.Schema(originSchemaMetadata, options)
    let model = mongoose.model(metadata.object.name, schema);
    this.applicationContext.models[<any>metadata.object.name] = model;
  }

  extractRules(metadata: any): any {
    let addons: any = {}
    if (metadata.options) {
      addons['options'] = metadata.options
      delete metadata['options']
    }
    if (metadata.methods) {
      addons['methods'] = metadata.methods
      delete metadata['methods']
    }
    if (metadata.staticMethods) {
      addons['staticMethods'] = metadata.staticMethods
      delete metadata['staticMethods']
    }
    if (metadata.invocations) {
      addons['invocations'] = metadata.invocations
      delete metadata['invocations']
    }
    return addons;
  }

  extractModelName(name: string): string {
    if (!name.match(/Schema/)) {
      throw new Error(`Failed to build domain, [reason]=schema named wrong, [name]=${name}`)
    }
    return name.replace('Schema', '')
  }
}