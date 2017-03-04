'use strict'

module.exports = function(modelConfigs, RestNative, Model) {
    const ModelBuilder = require('./build_model.js');
    var modelFactory = {}
    var models = Object.keys(modelConfigs)
    models.forEach(function(modelName) {
        if (/^[A-Z]/.test(modelName)) modelFactory[`${modelName}Model`] = ModelBuilder(modelConfigs[modelName], RestNative, Model);
        else modelFactory[`${modelName}Model`] = new (ModelBuilder(modelConfigs[modelName], RestNative, Model));
    })
    return modelFactory;
}
