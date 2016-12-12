'use strict'
const Collection = require('../collection.js')

class RestfulCollection extends Collection {

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
        return resp
    }
		
}

module.exports = RestfulCollection