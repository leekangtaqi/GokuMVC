import Application, { IContext } from '../'
import context from './context'
import mongooseMain from './mongoose'
import * as path from 'path'

let app = new Application()

app.addMember('mongoose', mongooseMain)

app.domainContext = context

async function main(){
  await app.readyAsync([path.join(__dirname, './modules')])
  app.listen(3030, () => {
    console.warn(`application is startup, listening on port 3030`)
  })
}

main();



