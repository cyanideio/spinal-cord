'use strict'

module.exports = function(modelConfigs, RestNative) {
    const ModelBuilder = require('./build_model.js')(RestNative);
    var modelFactory = {}
    var models = Object.keys(modelConfigs)
    models.forEach(function(modelName) {
        if (/^[A-Z]/.test(modelName)) modelFactory[`${modelName}Model`] = ModelBuilder(modelConfigs[modelName]);
        else modelFactory[`${modelName}Model`] = new(ModelBuilder(modelConfigs[modelName]));
    })
    return modelFactory;
}
