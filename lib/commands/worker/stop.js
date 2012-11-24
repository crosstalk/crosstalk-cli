/*
 * stop.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    util = require( 'util' ),
    verifyCrosstalkToken = require( '../verifyCrosstalkToken' );

var stop = function stop ( workerInstance, callback ) {

  var app = this;

  async.waterfall([

    // do we have a workerInstance? if not, get it
    function ( _callback ) {

      if ( ! workerInstance ) {

        app.log.help( 'You can also provide WORKER_INSTANCE as the first ' +
           'param' );
        app.log.help( 'crosstalk worker stop [WORKER_INSTANCE]'.cyan );

        getWorkerInstance.bind( app )( {}, _callback );

      } else {
        _callback( null, { workerInstance : workerInstance } );
      }

    }, // function ( _callback )

    verifyCrosstalkToken.bind( app ),

    stopWorker.bind( app )

  ], function ( error, dataBag ) {
    
    if ( error ) {

      app.log.error( typeof( error ) == 'object' ? 
        util.inspect( error ) : error );
      app.log.error( 'Failed to stop worker. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    var stopping = dataBag.response.stopping;
    var workerInstance = dataBag.response.workerInstance;

    if ( stopping ) {
      app.log.info( 'Worker ' + workerInstance.magenta + ' is stopping.' );
    } else {
      app.log.warn( 'Unexpected response from server.' );
    }

    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // stop;

module.exports = stop;

var getWorkerInstance = function getWorkerInstance ( dataBag, callback ) {

  var app = this;

  app.prompt.get( {
      message : 'Enter worker instance [ex. crosstalk-drone-worker-e2377...]',
      name : 'workerInstance',
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.workerInstance = params.workerInstance;
      callback( null, dataBag );

    } // function ( error, params )
  ); // app.prompt.get 'workerInstance'

}; // getWorkerInstance

var stopWorker = function stopWorker ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {},
      crosstalkToken = dataBag.crosstalkToken,
      workerInstance = dataBag.workerInstance;

  assert( crosstalkToken, "missing dataBag.crosstalkToken" );
  assert( workerInstance, "missing dataBag.workerInstance" );

  app.log.info( "Stopping worker " + workerInstance.magenta );

  app.api.send.send(
    crosstalkToken,
    '~crosstalk.api.worker.stop',
    {
      crosstalkToken : crosstalkToken,
      workerInstance : workerInstance
    },
    '~crosstalk',
    true,
    function ( error, result ) {

      if ( error ) { return callback( error ); }

      if ( result.error ) { return callback( result.error ); }

      dataBag.response = result.response;

      return callback( null, dataBag );

    } // function ( error, result )
  ); // app.api.send

}; // stopWorker