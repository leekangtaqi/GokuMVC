import mongooseMain from './mongoose'

let context = {
  redis: <any> null,
  mongoose: <any> {
    main: null
  }
}
context.mongoose.main = mongooseMain;

export default context