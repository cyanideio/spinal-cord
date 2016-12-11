'use strict'
const RestfulModel = require('./model.js')

class TastypieModel extends RestfulModel {

    parse(resp, options){
        if (resp.hasOwnProperty('objects')){
          return resp.length ? resp[0] : null
        } else {
          return resp
        }
    }
		
}

module.exports = TastypieModel