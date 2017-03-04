'use strict'
module.exports = function(config, RestNative, Model) {
    const RestfulModel = Model || require('../restful/model.js')(RestNative);
    class ConfigModel extends RestfulModel {
        constructor(data) {
            super(data);
            if (config.props) {
                Object.keys(config.props).forEach(function(propName){
                    Object.defineProperty(this,propName, config.props[propName])
                })
            }
        }
        get resource_name() {
            return config.resource_name;
        }

        get host() {
            return config.host;
        }
    }
    return ConfigModel;
}
