'use strict'
const should = require('should');
const RestfulModel = require('../src/restful/model')

let App = require('json-server')
let server = App.create()
let router = App.router('test/db.json')
let middlewares = App.defaults()

server.use(middlewares)
server.use(App.rewriter({
  '/:resource/:id/': '/:resource/:id'
}))
server.use(router)

class User extends RestfulModel {

  get resource_name() {
    return 'user'
  }

  get host() {
    return 'http://localhost:3000'
  }

  parse(resp, options){
    if (resp.constructor.name === 'Array'){
      if (resp.length == 1) {
        return resp[0]
      }
    if (resp.length == 0) {
        return null
      } else {
        throw new Error('multiple results returned')
      }
    } else {
      return resp
    }
  }

}

describe('Test Restful Backend', () => {

  before(() => {
    server.listen(3000,() => {
      console.log('Restful Server Online ...')
    })
  })

  it('should be able to search by id', (done) => {
    new User({ id: "1" })
    .fetch()
    .then((res)=>{ 
      res.should.have.property("username", "frank")
      done()
    })
  })

  it('should be able to get model by attrs', (done) => {
    new User({ "email": "frank.yao@cyanide.io" })
    .fetch()
    .then((res)=>{ 
      res.should.have.property("id", 1)
      done()
    })
  })

})