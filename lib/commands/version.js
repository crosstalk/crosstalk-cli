/*
 * version.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var version = function version ( callback ) {

  var app = this;

  app.api.version.version( function ( error, result ) {

    if ( error ) {

      app.log.error( 'Failed to get version. ' + 'NOT OK'.red );
      return callback( error );

    } // if ( error )

    var version = result && result.response && result.response.version;

    if ( ! version ) {

      app.log.error( 'Received unexpected response ' + result );
      return callback( error );

    } // if ( ! version )

    app.log.info( 'Crosstalk API version ' + version.magenta );

    return callback();

  }); // app.api.version

}; // version

version.usage = [
  'Retrieves current Crosstalk API version.',
  '',
  'crosstalk version',
  ''
];

module.exports = version;