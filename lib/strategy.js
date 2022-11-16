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
 * that includes an access token and optionally elements of the HTTP request.
 * The object is signed using a key known to the client.  By signing the object,
 * the client is demonstrating proof-of-possession of the key.  The key itself
 * is an additional credential, which does not transit the network when making a
 * protected resource request, and enhances security relative to using the
 * access token alone as a bearer credential.
 *
 * @public
 * @param {Object} [options]
 * @param {boolean} options.passReqToCallback - When `true`, the `verify`
 *          function receives the request object as the first argument, in
 *          conformance with `{@link verifyWithReqFn}`.  **Default:** `false`.
 * @param {verifyFn|verifyWithReqFn} verify - Function which verifies the access
 *          token.
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
  
  var signature;
  
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0]
        , credentials = parts[1];
        
      if (/^PoP$/i.test(scheme)) {
        signature = credentials;
      }
    } else {
      return this.fail(400);
    }
  }

  if (req.body && req.body.pop_access_token) {
    if (signature) { return this.fail(400); }
    signature = req.body.pop_access_token;
  }

  if (req.query && req.query.pop_access_token) {
    if (signature) { return this.fail(400); }
    signature = req.query.pop_access_token;
  }
  
  if (!signature) { return this.fail(this._challenge()); }
  
  var obj = jws.decode(signature, { json: true });
  
  var self = this;
  
  function verified(err, user, key, info) {
    var ok = jws.verify(signature, 'HS256', key);
    if (!ok) { return this.fail(this._challenge()); }
    
    if (err) { return self.error(err); }
    if (!user) {
      info = key;
      if (typeof info == 'string') {
        info = { message: info }
      }
      info = info || {};
      return self.fail(self._challenge('invalid_token', info.message));
    }
    
    self.success(user, info);
  }
  
  
  if (this._passReqToCallback) {
    this._verify(req, obj.payload.at, verified);
  } else {
    this._verify(obj.payload.at, verified);
  }
};


// Export `Strategy`.
module.exports = Strategy;
