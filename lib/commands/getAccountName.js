/*
 * getAccountName.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var getAccountName = function getAccountName ( dataBag, callback ) {

  var app = this;

  app.prompt.get( { message : 'Enter account name',
      name : 'accountName',
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.accountName = params.accountName;
      callback( null, dataBag );

    } // function ( error, params )
  ); // app.prompt.get 'accountName'

}; // getAccountName

module.exports = getAccountName;