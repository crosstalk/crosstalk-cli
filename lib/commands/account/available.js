/*
 * available.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var async = require( 'async' ),
    getAccountName = require( '../getAccountName' );

module.exports = function available( accountName, callback ) {

  var app = this;

  async.waterfall([

    // do we have an account name? if not, get it
    function ( callback ) {

      if ( ! accountName ) {

        app.log.help( 'You can also provide ACCOUNT_NAME as the first param.' );
        app.log.help( 'crosstalk account available [ACCOUNT_NAME]'.cyan );

        getAccountName.bind( app )( {}, callback );

      } else {
        callback( null, { accountName : accountName } );
      }

    }, // function ( callback )

    checkAccountNameAvailability.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {
      app.log.error( 'Failed to check availability. ' + 'NOT OK'.red );
      return callback( error );
    }

    app.log.help( 'See also:' );
    app.log.help( 'crosstalk login'.cyan + ' to login' );
    app.log.help( 'crosstalk logout'.cyan + ' to logout' );

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // create

var checkAccountNameAvailability = function checkAccountNameAvailability(
    dataBag, callback ) {

  var app = this,
      accountName = dataBag.accountName || '';

  app.log.info( 'Checking availability of ' + accountName.magenta );

  app.api.accounts.available( accountName, function ( error, result ) {

    if ( error ) { return callback( error ); }
    
    var msg = 'Account name ' + accountName.magenta + ' is ';
    msg += result.available ? 'available'.green : 'not available'.red;
    app.log.info( msg );
    callback( null, result );

  }); // app.api.accounts.available accountName

}; // checkAccountNameAvailability