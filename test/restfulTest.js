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
      return resp.length ? resp[0] : null
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

  it('should search by id', (done) => {
    new User({ id: "1" })
    .get()
    .then((res)=>{ 
      res.should.have.property("username", "frank")
      done()
    })
  })

  it('should get model by attributes', (done) => {
    new User({ "email": "frank.yao@cyanide.io" })
    .get()
    .then((res)=>{ 
      res.should.have.property("id", 1)
      done()
    })
  })

  it('should create model', (done) => {
    new User({ 
      "email": "yaame.zhu@cyanide.io",
      "mobile": "13394058373"
    })
    .save()
    .then((res)=>{ 
      res.should.have.property("mobile", "13394058373")
      done()
    })
  })

  it('should update model', (done) => {
    let user = new User({ "email": "yaame.zhu@cyanide.io" })
    user.get()
    .then(res =>{ return user.save({ "email": "yaame.zhu_1@cyanide.io" }) })
    .then((res)=>{ 
      res.should.have.property("email", "yaame.zhu_1@cyanide.io")
      done()
    })   
  })

  it('should fetch one model with same condition', (done) => {
    new User({ "email": "yaame.zhu@cyanide.io", "mobile": "13394058373"}).save()
    .then((res)=>{ 
      new User({ "email": "yaame.zhu@cyanide.io" }).save()
      .then((res)=>{
         let user = new User({ "email": "yaame.zhu@cyanide.io" })
         user.get().then((res)=>{
          user.should.have.property("mobile", "13394058373")
          done()
         })
      })
    })
  })

  it('should delete model', (done) => {
    var user0 = new User({ "email": "yaame.zhu_1@cyanide.io" })
    var user1 = new User({ "mobile": "13394058373" })
    var user2 = new User({ "email": "yaame.zhu@cyanide.io" })
    user0.get()
    .then((res)=>{ return user0.delete() })
    .then((res)=>{ return user1.get() })
    .then((res)=>{ return user1.delete() })
    .then((res)=>{ return user2.get() })
    .then((res)=>{ return user2.delete() })
    .then((res)=>{ 
      res.should.be.an.instanceOf(Object)
      done()
    })
  })

})