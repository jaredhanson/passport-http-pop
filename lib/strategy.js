// Load modules.
var passport = require('passport-strategy');


function PoPStrategy(options, verify) {
  passport.Strategy.call(this);
}

// Inherit from `passport.Strategy`.
util.inherits(OAuth2Strategy, passport.Strategy);


OAuth2Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  
};


// Expose constructor.
module.exports = OAuth2Strategy;
