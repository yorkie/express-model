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
  if (!fn || typeof fn === 'function')
    throw new Error('fn required');

  var symbols;
  if (Object.prototype.toString.call(name) === 'array') {
    symbols = name;
  } else {
    symbols = [name];
  };
  
  var args = symbols.map(function(symbol) {
    return new dbContext(symbol);
  })
  fn.apply(this, args);
}

// create a readable stream for a database
default_DB.createReadStream = function(name) {
  // TODO
}

// create a writable stream for another database
default_DB.createWriteStream = function(name) {
  // TODO
}

module.exports = default_DB
// End - !