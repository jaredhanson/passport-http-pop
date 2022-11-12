// Module dependencies.
var Strategy = require('./strategy');


/**
 * Creates a new `{@link Strategy}` object.
 *
 * The `{@link Strategy}` constructor is a top-level function exported by the
 * `passport-local` module.
 *
 * @example
 * var Strategy = require('passport-http-pop');
 * var strategy = new Strategy(function(username, password, cb) {
 *   // ...
 * });
 */
exports = module.exports = Strategy;

/**
 * Creates a new `{@link Strategy}` object.
 *
 * @example
 * var pop = require('passport-http-pop');
 * var strategy = new pop.Strategy(function(username, password, cb) {
 *   // ...
 * });
 */
exports.Strategy = Strategy;
