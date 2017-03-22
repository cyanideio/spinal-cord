'use strict'
module.exports = function(config, RestNative, Model) {
    const RestfulModel = Model || require('../restful/model.js')(RestNative);
    class ConfigModel extends RestfulModel {
        get resource_name() {
            return config.resource_name;
        }

        get host() {
            return config.host;
        }
    }

    if (config && config.props) {
        Object.keys(config.props).forEach(function(propName) {
            Object.defineProperty(ConfigModel.prototype, propName, config.props[propName])
        })
    }

    return ConfigModel;
}
