/**
 * HTTP PoP authentication.
 *
 * The `passport-http-pop` module provides a {@link https://www.passportjs.org/ Passport}
 * strategy for authenticating an HTTP request using the PoP authentication
 * scheme.
 *
 * The PoP authentication scheme uses a credential that is a signed JSON object,
 * structured as a {@link https://www.rfc-editor.org/rfc/rfc7515 JSON Web Signature (JWS)}.
 * The object includes an access token and optionally elements of the HTTP
 * request, and is signed using a key known to the client.  By signing the
 * object, the client is demonstrating proof-of-possession of the key.  This
 * enhances security relative to using the access token alone as a bearer
 * credential.
 *
 * The PoP authentication scheme is defined by multiple internet drafts.  The
 * first, {@link https://datatracker.ietf.org/doc/html/draft-ietf-oauth-signed-http-request-03 draft-ietf-oauth-signed-http-request},
 * was adopted by the {@link https://datatracker.ietf.org/wg/oauth/about/ OAuth Working Group}
 * but expired August 08, 2016.  Another, {@link https://datatracker.ietf.org/doc/html/draft-richanna-oauth-http-signature-pop-00 draft-richanna-oauth-http-signature-pop},
 * was submitted by Annabelle Backman but expired November 19, 2019.  This draft
 * is accompanied by {@link https://datatracker.ietf.org/doc/html/draft-richanna-http-jwt-signature-00 draft-richanna-http-jwt-signature},
 * which specifies how to sign over elements of the HTTP request.  These later
 * drafts are functionally equivalent to the earlier draft, but split into two
 * separate specifications.  Note that the later draft requires that the JWS be
 * explicitly typed (with a value of `http-sig`), as {@link https://datatracker.ietf.org/doc/html/rfc8725#section-3.11 recommended}
 * by current best practices.
 *
 * To utilize the PoP authentication scheme, a signing key needs to be
 * distributed to both the client (which uses the key to sign the JWS) and the
 * resource server (which uses the key to verify the signature).  Key
 * distribution to the client is typically done via {@link https://www.rfc-editor.org/rfc/rfc6749
 * OAuth 2.0}, and the extension defined by {@link https://datatracker.ietf.org/doc/html/draft-ietf-oauth-pop-key-distribution-07
 * Authorization Server to Client Key Distribution}.  Key distribution to the
 * resource server varies with the structure of the access token.  When access
 * tokens are structured as {@link https://www.rfc-editor.org/rfc/rfc7519 JWT},
 * {@link https://www.rfc-editor.org/rfc/rfc7800 RFC 7800} is suitable.  When
 * access tokens are structured as {@link https://www.rfc-editor.org/rfc/rfc8392
 * CWT}, {@link https://www.rfc-editor.org/rfc/rfc8747 RFC 8747} is suitable.
 *
 * @module passport-http-pop
 */

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
