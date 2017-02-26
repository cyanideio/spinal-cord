'use strict'
const ModelBuilder = require('./build_model.js');

module.exports = function(modelConfigs) {
    var modelFactory = {}
    var models = Object.keys(modelConfigs)
    models.forEach(function(modelName){
        if(/^[A-Z]/.test(modelName)) modelFactory[`${modelName}Model`] = ModelBuilder(modelConfigs[modelName]);
        else modelFactory[`${modelName}Model`] = new (ModelBuilder(modelConfigs[modelName]));
    })
    return modelFactory;
}