export default {
  assert: (...args:Array<any>) => {
    let expectes = args.slice(0, args.length - 1)
    let message = args.slice(-1)
    for (let expect of expectes) {
      !expect && console.error(message)
    }
  }
}