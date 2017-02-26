'use strict'

const AjaxMethod = require('./src/frontends/ajax')
const RestNative = require('./src/frontends/restful-native')
const Collection = require('./src/collection')(RestNative)
const Model = require('./src/model')(RestNative)
const RestfulModel = require('./src/restful/model')(RestNative)
const RestfulCollection = require('./src/restful/collection')(RestNative)
const TastypieCollection = require('./src/restful/tastypie_collection')(RestNative)
const TastypieModel = require('./src/restful/tastypie_model')(RestNative)

const ModelBuilder = require('./src/export/build_model')
const ModelFactory = require('./src/export/model_factory')
module.exports = {
    Frontends: {
		RestNative: RestNative,
		AjaxMethod: AjaxMethod
    },
    Collection: Collection,
    Model: Model,
    Restful: {
    	Collection: RestfulCollection,
    	Model: RestfulModel,
    	Tastypie: {
	    	Collection: TastypieCollection,
    		Model: TastypieModel
    	}
    },
    Builder: {
        Model: function(config) {
            return ModelBuilder(config, RestNative)
        }
    },
    Factory: {
        Model: function(config) {
            return ModelFactory(config, RestNative)
        }
    }
}
