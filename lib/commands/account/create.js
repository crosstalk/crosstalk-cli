/*
 * create.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    getAccountName = require( '../getAccountName' ),
    getPassword = require( '../getPassword' );

module.exports = function create( accountName, callback ) {

  var app = this;

  app.log.info( 'Preparing to create a Crosstalk account...' );

  async.waterfall([

    // do we have an account name? if not, get it
    function ( callback ) {

      if ( ! accountName ) {

        app.log.help( 'You can also provide ACCOUNT_NAME as the first param.' );
        app.log.help( 'crosstalk account create [ACCOUNT_NAME]'.cyan );

        getAccountName.bind( app )( {}, callback );

      } else {
        callback( null, { accountName : accountName } );
      }
    },

    getEmail.bind( app ),

    getMatchingPasswords.bind( app ),

    createAccount.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( error );
      error.result ? app.log.error( JSON.stringify( error.result ) ) : null;

      app.log.error( 'Failed to create account. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    app.log.help( 'See also:' );
    app.log.help( 'crosstalk login'.cyan + ' to login' );
    app.log.help( 'crosstalk logout'.cyan + ' to logout' );

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // create

var confirmPassword = function confirmPassword ( dataBag, callback ) {

  var app = this;

  app.prompt.get( 
    { 
      message : 'Confirm your password',
      name : 'confirmPassword',
      hidden : true,
      required : true
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.confirmPassword = params.confirmPassword;
      callback( null, dataBag );

    }
  ); // app.prompt.get 'confirmPassword'

}; // confirmPassword

var createAccount = function createAccount ( dataBag, callback ) {

  var app = this,
      accountName = dataBag.accountName,
      email = dataBag.email,
      password = dataBag.password;

  assert( accountName, "missing accountName" );
  assert( email, "missing email" );
  assert( password, "missing password" );

  app.log.info( "Creating account for " + accountName.magenta );

  app.api.accounts.create( accountName, email, password, function ( error, result ) {

    if ( error ) { return callback( error ); }

    app.log.info( 'Account created for ' + accountName.magenta );
    app.log.info( "*****************************************************************************" );
    app.log.info( "" );
    app.log.info( "   NEXT STEPS:" );
    app.log.info( "   Thank you for creating your Crosstalk account." );
    app.log.info( "   We will send you an activation link to the email address you " );
    app.log.info( "   provided when we're ready to support your account." );
    app.log.info( "   In the meantime, remember to " + "npm install crosstalk-ide".magenta );
    app.log.info( "   and checkout the HOWTOs and examples:" );
    app.log.info( "     https://github.com/crosstalk/crosstalk-ide/wiki/Hello-World-HOWTO".magenta );
    app.log.info( "     https://github.com/crosstalk/crosstalk-ide/wiki/Crosstalk-environment".magenta );
    app.log.info( "     https://github.com/crosstalk/crosstalk-ide/tree/master/examples".magenta );
    app.log.info( "" );
    app.log.info( "   If you have any questions feel free to get in touch with" );
    app.log.info( "   Tristan, Crosstalk CTO, via email: tristan@crxtalk.com" );
    app.log.info( "" );
    app.log.info( "   Cheers!" );
    app.log.info( "" );
    app.log.info( "*****************************************************************************" );
    callback( null, result );

  }); // app.api.accounts.create

}; // createAccount

var getEmail = function getEmail ( dataBag, callback ) {

  var app = this;

  app.prompt.get( 
    { 
      name : 'email',
      pattern : /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      description : 'Enter your email address',
      message : 'Please provide a valid email address',
      required : true
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.email = params.email;
      callback( null, dataBag );

    }
  ); // app.prompt.get 'email'

}; // getEmail

var getMatchingPasswords = function getMatchingPasswords ( dataBag, callback ) {

  var app = this;

  app.log.warn( "********************************************************************".red );
  app.log.warn( "" );
  app.log.warn( "                   *** SECURITY NOTICE ***".red );
  app.log.warn( "   While Crosstalk is in the current alpha development stage,".red );
  app.log.warn( "   it's messages are being heavily logged for debugging purposes.".red );
  app.log.warn( "   For now, please DO NOT provide a password that you cannot".red );
  app.log.warn( "   make known to Crosstalk.".red );
  app.log.warn( "" );
  app.log.warn( "   In the future, this will no longer be the case.".red );
  app.log.warn( "" );
  app.log.warn( "   Aside from the above consideration, your passwords are being".red );
  app.log.warn( "   securely one-way hashed using thousands of iterations ".red );
  app.log.warn( "   of cryptographic one-way hash with individual and ".red );
  app.log.warn( "   application-wide salt components.".red );
  app.log.warn( "" );
  app.log.warn( "********************************************************************".red );

  async.waterfall([

    function ( _callback ) {
      getPassword.bind( app )( dataBag, _callback );
    },

    confirmPassword.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) { return callback( error ); }

    // check that passwords match
    if ( dataBag.password && dataBag.password == dataBag.confirmPassword ) {
      return callback( null, dataBag );
    }

    app.log.error( "Passwords don't match, please try again." );

    // passwords don't match, go again
    dataBag.password = null;
    dataBag.confirmPassword = null;
    return getMatchingPasswords.bind( app )( dataBag, callback );

  }); // async.waterfall

}; // getMatchingPasswords