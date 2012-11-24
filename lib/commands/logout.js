/*
 * logut.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' );

var logout = function logout ( callback ) {

  var app = this;

  app.log.info( 'Preparing to logout...' );

  if ( ! app.config.get( 'crosstalkToken' ) ) {

    app.log.info( 'Not logged in.' );

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  } // if not logged in (no crosstalkToken)

  return logoutFromAccount.bind( app )( 
     { token : app.config.get( 'crosstalkToken' ) }, 
     function ( error, result ) {

    if ( error ) {

      app.log.error( error );
      error.result ? app.log.error( JSON.stringify( error.result ) ) : null;

      app.log.error( 'Failed to logout. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    // delete crosstalkToken from local store
    delete app.config.stores.file.store.crosstalkToken;
    app.config.save( function ( param ) {

      app.log.help( 'See also:' );
      app.log.help( 'crosstalk login [ACCOUNT_NAME]'.cyan + ' to login' );

      app.log.info( 'Crosstalk ' + 'OK'.green );

      return callback();

    }); // app.config.save

  }); // logoutFromAccount callback

}; // logout

logout.usage = [
  'Logs out by invalidating and deleting current authorization token.',
  '',
  'crosstalk logout',
  ''
];

module.exports = logout;

var logoutFromAccount = function logoutFromAccount ( dataBag, callback ) {

  var app = this,
      token = dataBag.token;

  app.log.info( "Logging out" );

  app.api.logout.logout( token, function ( error, result ) {

    if ( error ) { return callback( error ); }

    return callback( null, dataBag );

  }); // app.api.logout

}; // logoutFromAccount