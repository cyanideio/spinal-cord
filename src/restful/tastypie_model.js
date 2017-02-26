'use strict'
module.exports = function(RestNative) {

    const RestfulModel = require('./model.js')(RestNative)

    class TastypieModel extends RestfulModel {

        parse(resp, options) {
            if (resp.hasOwnProperty('objects')) {
                return resp.length ? resp.objects[0] : null
            } else {
                return resp
            }
        }

    }
	return TastypieModel
}
