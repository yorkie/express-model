/* DB Helper */

var fs = require('fs')
var defaultDB = 'mongoose'
var dbSet = fs.readdirSync(__dirname + '/supportDB').map(function(name) {
	return name.slice(0, -3)
})

if (dbSet.indexOf(defaultDB) === -1)
	throw 'You must contain the default database driver: mongoose';

// create a new context for a database
function dbContext(name) {

	var i = dbSet.indexOf(name)
	var o = dbSet[i]
	return require(o);
}

default_DB = require(defaultDB)
default_DB.use = function(name, fn) {
	var thisDatabaseContext = (!name || name == defaultDB) ? module.exports : ( new dbContext(name) )
	if (fn) {
		fn(thisDatabaseContext)
	}
	return thisDatabaseContext;
}

module.exports = default_DB
// End - !