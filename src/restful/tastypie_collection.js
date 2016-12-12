'use strict'
const RestfulCollection = require('./collection')

class TastypieCollection extends RestfulCollection {

    parse(resp, options){
        if (resp.hasOwnProperty('objects')){
          return resp.length ? resp.objects[0] : null
        } else {
          return resp
        }
    }
		
}

module.exports = TastypieCollection