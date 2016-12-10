'use strict'
const should = require('should');

let App = require('json-server')
let server = App.create()
let router = App.router('db.json')
let middlewares = App.defaults()

server.use(middlewares)
server.use(router)

describe('Test Restful Backend', () => {

  before(() => {
    server.listen(3000,() => {
      console.log('JSON Server is running')
    })
  })

  // Shut down all the Target Server after the test
  after((done) => {
    done()
  });

  it('should reject request with invalid paths', (done) => {
    console.log('wat')
    done()
  })

})