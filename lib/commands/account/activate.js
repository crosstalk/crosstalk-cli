/*
 * activate.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var async = require( 'async' ),
    getAccountName = require( '../getAccountName' );

var activate = function activate ( accountName, activationToken, callback ) {

  var app = this;

  async.waterfall([

    // do we have an account name? if not, get it
    function ( _callback ) {

      if ( ! accountName ) {

        app.log.help( 'You can also provide ACCOUNT_NAME as the first param.' );
        app.log.help( 'crosstalk account activate [ACCOUNT_NAME] ' +
           '[ACTIVATION_TOKEN]'.cyan );

        getAccountName.bind( app )( {}, _callback );

      } else {
        _callback( null, { accountName : accountName } );
      }

    }, // account name

    function ( dataBag, _callback ) {

      if ( ! activationToken ) {

        app.log.help( 'You can also provide ACTIVATION_TOKEN as the second ' +
           'param.' );
        app.log.help( 'crosstalk account activate [ACCOUNT_NAME] ' +
           '[ACTIVATION_TOKEN]'.cyan );

        app.prompt.get( { 
          message : 'Enter activation token',
          name : 'activationToken'
        }, function ( error, params ) {

          if ( error ) return _callback( error );

          dataBag.activationToken = params.activationToken;
          return _callback( null, dataBag );

        }); // app.prompt.get

      } else {

        dataBag.activationToken = activationToken;
        _callback( null, dataBag );

      } // else

    }, // activation token

    doActivation.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( error );
      error.result ? app.log.error( JSON.stringify( error.result ) ) : null;

      app.log.error( 'Failed to activate account. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    app.log.help( 'See also:' );
    app.log.help( 'crosstalk login'.cyan + ' to login' );
    app.log.help( 'crosstalk signup'.cyan + ' to signup' );

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // activate

var doActivation = function doActivation ( dataBag, callback ) {

  var app = this,
      accountName = dataBag.accountName || '',
      activationToken = dataBag.activationToken || '';

  app.log.info( 'Activating ' + accountName.magenta );

  app.api.accounts.activate( accountName, activationToken, 
     function ( error, result ) {

    if ( error ) return callback( error );

    var msg = '';

    if ( result.response.activated ) {
      msg += 'Account ' + accountName.magenta + ' is now active';
    } else {

      msg += 'Failed to activate account ' + accountName.magenta + ' using ' +
         'activation token: ' + activationToken.magenta;

    } // else

    app.log.info( msg );
    return callback( null, result );

  }); // app.api.accounts.activate

}; // doActivation

module.exports = activate;