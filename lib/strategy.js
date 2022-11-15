// Module dependencies.
var passport = require('passport-strategy')
  , jws = require('jws')
  , util = require('util');


/**
 * Create a new `Strategy` object.
 *
 * @class
 * @classdesc This `Strategy` is responsible for authenticating requests that
 * use the PoP authentication scheme.  The credential is a signed JSON object
 * that includes an access token and optionally parameters of the HTTP request.
 * The object is signed using a key known to the client.  By signing the object,
 * the client is demonstrating proof-of-possession the key.  The key itself is
 * an additional credential, which does not transit the network when making a
 * protected resource request, and enhances security relative to using the
 * access token alone as a bearer credential.
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('HTTPDPoPStrategy requires a verify function'); }
  
  passport.Strategy.call(this);
  this.name = 'pop';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
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
  
  
  console.log(signed);
  
  var jwt = jws.decode(signed, { json: true });
  
  console.log(jwt)
  
  
  var self = this;
  
  function verified(err, user, key, info) {
    console.log(err);
    console.log(user);
    console.log(key);
    
    // FIXME: Put this back
    //var ok = jws.verify(signed, 'HS256', key);
    //console.log(ok);
    
    if (err) { return self.error(err); }
    if (!user) {
      if (typeof info == 'string') {
        info = { message: info }
      }
      info = info || {};
      return self.fail(self._challenge('invalid_token', info.message));
    }
    
    /*
    var thumbprint = jwkThumbprint(jwt.header.jwk, 'SHA-256');
    if (binding !== base64url.encode(thumbprint)) {
      return this.fail(this._challenge('invalid_dpop_proof', 'Public key binding not confirmed'));
    }
    */
    
    self.success(user, info);
  }
  
  
  if (this._passReqToCallback) {
    this._verify(req, jwt.payload.at, verified);
  } else {
    this._verify(jwt.payload.at, verified);
  }
};


// Export `Strategy`.
module.exports = Strategy;
