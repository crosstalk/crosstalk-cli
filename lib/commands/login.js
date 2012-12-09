/*
 * login.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    fs = require( "fs" ),
    getAccountName = require( './getAccountName' ),
    getPassword = require( './getPassword' );

var login = function login ( accountName, password, callback ) {

  var app = this;

  app.log.info( 'Preparing to login...' );

  async.waterfall([

    // do we have an account name? if not, get it
    function ( _callback ) {

      if ( ! accountName ) {

        app.log.help( 'You can also provide ACCOUNT_NAME as the first param.' );
        app.log.help( 'crosstalk login [ACCOUNT_NAME]'.cyan );

        getAccountName.bind( app )( {}, _callback );

      } else {
        _callback( null, { accountName : accountName, password : password } );
      }

    }, // function ( _callback )

    getPassword.bind( app ),

    loginToAccount.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( error );
      error.result ? app.log.error( JSON.stringify( error.result ) ) : null;

      app.log.error( 'Failed to login. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    // put crosstalkToken into local store
    app.config.stores.user.store.crosstalkToken = dataBag.crosstalkToken;
    app.config.stores.user.save( function ( param ) {

      app.log.help( 'See also:' );
      app.log.help( 'crosstalk logout'.cyan + ' to logout' );

      app.log.info( 'Crosstalk ' + 'OK'.green );

      return callback();

    }); // write crosstalkToken to config file

  }); // async.waterfall

}; // login

login.usage = [
  'Retrieves authorization token for interaction with Crosstalk API.',
  '',
  'crosstalk login [ACCOUNT] [PASSWORD]',
  ''
];

module.exports = login;

var loginToAccount = function loginToAccount ( dataBag, callback ) {

  var app = this,
      accountName = dataBag.accountName,
      password = dataBag.password;

  assert( accountName, "missing accountName" );
  assert( password, "missing password" );

  app.log.info( "Logging into account " + accountName.magenta );

  app.api.login.login( accountName, password, function ( error, result ) {

    if ( error ) { return callback( error ); }

    var token = result && result.token;

    if ( ! token ) {

      app.log.error( 'Received unexpected response ' + 
        ( typeof( result ) == 'object' ? JSON.stringify( result ) : result ) );
      return callback( error );

    } // if ( ! token )

    app.log.info( 'Retrieved authorization token ' + token.magenta );
    dataBag.crosstalkToken = token;

    return callback( null, dataBag );

  }); // app.api.login

}; // loginToAccount
