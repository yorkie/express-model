/* express-model */

/**
 * define a certain number of global variables
 */

var models = {}
var util = require('util')
var fs = require('fs')
var db = require('./dbHelper')

/**
 * isFunction
 */

function isFunction(fn) {
	return Object.prototype.toString.call(fn) === '[object Function]'
}

/**
 * define a Model
 */

function _defineModel(modelId, fn) {

	var newModel = Object.create(null)
	fn.apply(this, [ newModel, db, Object.create(null) ])

	return models[modelId] = newModel
}

/**
 * use a Model
 */

function _useModel(modelId, args, fn) {

	var result = models[modelId]
	if (!result)
		throw util.format('Model: %s not found', modelId)

	if (!args) {
		args = []
	}

	if (!util.isArray(args)) {
		if (!isFunction(args)) {
			args = [args]
		} else {
			fn = args;
			args = [];
		}
	}

	if (!isFunction(fn)) {
		fn = function() {}
	}

	if (result._constructor) {
		result._constructor.apply(this, args)
		delete result._constructor
	}

	fn.apply(result)
	return result
}

/**
 * load models
 */

function _initModels(err, files, path) {
	
	if (err) throw '';
	if (!files.length) return;

	// If you are atmpting to define models in a 2nd directory, you must require it by hands.
	files.filter(function(file) {
		if (/\.js$/.test(file)) 
		require(util.format('%s/%s', path, file))
	})
}

/**
 * exports
 */

module.exports = function(path) {

	if (!path) throw '';
	fs.readdir(path, function(err, files) {
		_initModels(err, files, path)
	})

	return {
		define: _defineModel,
		use: _useModel
	}
}

// End - !