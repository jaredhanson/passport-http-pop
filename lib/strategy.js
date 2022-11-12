// Module dependencies.
var passport = require('passport-strategy')
  , util = require('util');


function Strategy(options, verify) {
  passport.Strategy.call(this);
}

// Inherit from `passport.Strategy`.
util.inherits(Strategy, passport.Strategy);


Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  
};


// Export `Strategy`.
module.exports = Strategy;
