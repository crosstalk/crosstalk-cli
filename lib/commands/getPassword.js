/*
 * getPassword.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var getPassword = function getPassword ( dataBag, callback ) {

  var app = this;

  app.prompt.get( 
    { 
      message : 'Enter your password',
      name : 'password',
      hidden : true,
      requried : true
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.password = params.password;
      callback( null, dataBag );

    }
  ); // app.prompt.get 'password'

}; // getPassword

module.exports = getPassword;