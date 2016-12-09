'use strict'
const Model = require('../model.js')

class TastypieModel extends Model {

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
    	if (resp.hasOwnProperty('objects')){
    		if (resp.objects.length == 1) {
    			return resp.objects[0]
    		}
			if (resp.objects.length == 0) {
    			return null
    		} else {
    			throw new Error('multiple results returned')
    		}
    	} else {
    		return resp
    	}
    }
		
}

module.exports = TastypieModel