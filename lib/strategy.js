// Module dependencies.
var passport = require('passport-strategy')
  , util = require('util');


function Strategy(options, verify) {
  passport.Strategy.call(this);
  this.name = 'pop';
}

// Inherit from `passport.Strategy`.
util.inherits(Strategy, passport.Strategy);


Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  
  
  var signed;
  
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0]
        , credentials = parts[1];
        
      if (/^PoP$/i.test(scheme)) {
        signed = credentials;
      }
    } else {
      return this.fail(400);
    }
  }

  if (req.body && req.body.pop_access_token) {
    if (signed) { return this.fail(400); }
    signed = req.body.pop_access_token;
  }

  if (req.query && req.query.pop_access_token) {
    if (signed) { return this.fail(400); }
    signed = req.query.pop_access_token;
  }
  
  if (!signed) { return this.fail(this._challenge()); }
  
  
};


// Export `Strategy`.
module.exports = Strategy;
