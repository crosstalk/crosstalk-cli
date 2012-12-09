/*
 * start.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    semver = require( 'semver' ),
    util = require( 'util' ),
    verifyCrosstalkToken = require( '../verifyCrosstalkToken' );

var start = function start ( workerName, callback ) {

  var app = this;

  async.waterfall([

    // do we have a worker name? if not, get it
    function ( _callback ) {

      if ( ! workerName ) {

        app.log.help( 'You can also provide WORKER@VERSION as the ' +
           'first param.' );
        app.log.help( 'crosstalk worker start [WORKER@VERSION]'.cyan );

        getWorkerName.bind( app )( {}, _callback );

      } else {
        _callback( null, { workerName : workerName } );
      }

    }, // function _callback

    verifyCrosstalkToken.bind( app ),

    getConfigurationPath.bind( app ),

    getConfiguration.bind( app ),

    startWorker.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( typeof( error ) == 'object' ? 
        util.inspect( error ) : error );
      app.log.error( 'Failed to start worker. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    var workerInstance = dataBag.response.workerInstance;

    app.log.info( 'Worker ' + dataBag.workerName.magenta + ' started ' +
      'as ' + workerInstance.magenta );
    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // start

module.exports = start;

var getConfiguration = function getConfiguration ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {},
      configurationPath = dataBag.configurationPath;

  assert( configurationPath, 'missing configurationPath' );

  try {

    var configuration;
    if (configurationPath.substr(0,1) == '/') {
      configuration = require( configurationPath );
    } else {
      console.log( path.join( process.env.PWD, configurationPath ) );
      configuration = require( path.join( process.env.PWD, configurationPath ) );
    }

    dataBag.configuration = configuration;
    return callback( null, dataBag );

  } catch ( exception ) {
    app.log.error( exception );
    return callback( new Error( 'Unable to process configuration file.' ) );
  }

}; // getConfiguration

var getConfigurationPath = function getConfigurationPath ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {};

  app.prompt.get( {
    message : 'Path to worker configuration JSON file',
    name : 'configurationPath',
    validator : {
      test : function ( _path ) {

        try {

          var configuration;
          if (_path.substr(0,1) == '/') {
            configuration = require( _path );
          } else {
            console.log( path.join( process.env.PWD, _path ) );
            configuration = require( path.join( process.env.PWD, _path ) );
          }
          return true;
        
        } catch ( exception ) {
          app.log.error( exception );
          return false;
        }

      } // test
    } // validator
  }, function ( error, params ) {

    if ( error ) { return callback( error ); }

    dataBag.configurationPath = params.configurationPath;
    return callback( null, dataBag );

  }); // app.prompt.get 'configurationPath'

}; // getConfigurationPath

var getWorkerName = function getWorkerName ( dataBag, callback ) {

  var app = this;

  app.prompt.get( { 
      message : 'Enter worker and version [ex. myWorker@0.1.1]',
      name : 'workerName',
      validator : {
        test: semver.validPackage
      }
    }, function ( error, params ) {

      if ( error ) { return callback( error ); }

      dataBag.workerName = params.workerName;
      callback( null, dataBag );

    } // function ( error, params )
  ); // app.prompt.get 'workerName'

}; // getWorkerName

var startWorker = function startWorker ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {},
      configuration = dataBag.configuration,
      crosstalkToken = dataBag.crosstalkToken,
      workerName = dataBag.workerName;

  assert( configuration, "missing dataBag.configuration" );
  assert( crosstalkToken, "missing dataBag.crosstalkToken" );
  assert( workerName, "missing dataBag.workerName" );

  app.log.info( "Starting worker " + workerName.magenta );

  app.api.send.send(
    crosstalkToken,
    '~crosstalk.api.worker.start',
    {
      crosstalkToken : crosstalkToken,
      configuration : configuration,
      worker : workerName
    },
    '~crosstalk',
    true,
    function ( error, result ) {

      if ( error ) { return callback( error ); }

      if ( result.error ) { return callback( result.error ); }

      dataBag.response = result.response;

      return callback( null, dataBag );

  }); // app.api.send

}; // startWorker