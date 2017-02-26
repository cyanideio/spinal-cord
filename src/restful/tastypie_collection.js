'use strict'
module.exports = function(RestNative) {

    const RestfulCollection = require('./collection')(RestNative)

    class TastypieCollection extends RestfulCollection {

        parse(resp, options) {
            if (resp.hasOwnProperty('objects')) {
                return resp.length ? resp.objects[0] : null
            } else {
                return resp
            }
        }

    }

    return TastypieCollection
}
