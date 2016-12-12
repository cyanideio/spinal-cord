'use strict'
const Model = require('../model.js')

class RestfulModel extends Model {

	get resource_name(){
		throw Error('unimplemented')
	}

	get host(){
		throw Error('unimplemented')
	}

	get url() {
		return `${this.host}/${this.resource_name}/`
	}

  parse(resp, options){
    if (resp.constructor.name === 'Array'){
      return resp.length ? resp[0] : null
    } else {
      return resp
    }
  }
		
}

module.exports = RestfulModel