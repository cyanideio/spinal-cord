'use strict'
const RestfulModel = require('./model.js')

class TastypieModel extends RestfulModel {

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