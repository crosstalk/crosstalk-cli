/*
 * verifyCrosstalkToken.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var verifyCrosstalkToken = function verifyCrosstalkToken ( dataBag, callback ) {

  var app = this,
      crosstalkToken = app.config.get( 'crosstalkToken' );

  if ( ! crosstalkToken ) {

    return callback( {
      result : "Not logged in."
    });

  } // if ( ! app.config.get( 'crosstalkToken' ) )

  dataBag.crosstalkToken = crosstalkToken;
  return callback( null, dataBag );

}; // verifyCrosstalkToken

module.exports = verifyCrosstalkToken;