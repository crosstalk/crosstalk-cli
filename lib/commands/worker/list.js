/*
 * list.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    util = require( 'util' ),
    verifyCrosstalkToken = require( '../verifyCrosstalkToken' );

var list = function list ( callback ) {

  var app = this;

  async.waterfall([

    function ( _callback ) {
      verifyCrosstalkToken.bind( app )( {}, _callback );
    },

    getWorkersFromCrosstalk.bind( app ),

    displayWorkers.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( typeof( error ) == 'object' ?  util.inspect( error ) : error );
      app.log.error( 'Failed to retrieve uploaded worker list. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // list

module.exports = list;

var displayWorkers = function displayWorkers ( dataBag, callback ) {

  var app = this,
      workers = dataBag.workers;

  assert( workers, "missing workers" );

  app.log.data( ( 'workers(' + workers.length + '):' ).grey );

  workers.forEach( function ( worker ) {

    app.log.data( ' '.grey + worker.worker.magenta );

  }); // workers.forEach

  return callback( null, dataBag );

}; // displayWorkers

var getWorkersFromCrosstalk = function getWorkersFromCrosstalk ( dataBag, callback ) {

  var app = this,
      crosstalkToken = dataBag.crosstalkToken;

  assert( crosstalkToken, "missing crosstalkToken" );

  app.log.info( "Retrieving uploaded worker list" );

  app.api.send.send( crosstalkToken, '~crosstalk.api.worker.list',
     { crosstalkToken : crosstalkToken }, '~crosstalk', true, 
     function ( error, result ) {

    if ( error ) { return callback ( error ); }

    dataBag.workers = result.response.workers;

    return callback( null, dataBag );

  }); // app.api.send

}; // getWorkersFromCrosstalk