'use strict'
const RestfulModel = require('../restful/model.js');

module.exports = function(config) {
    class ConfigModel extends RestfulModel {
        get resource_name() {
            return config.resource_name;
        }

        get host() {
            return config.host;
        }
    }
    return ConfigModel;
}
