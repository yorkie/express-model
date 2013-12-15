var Mongolian = require('mongolian');
var util = require('util');

module.exports = Mongo;

function Mongo() {
  Mongolian.call(this);
}
util.inherits(Mongo, Mongolian);