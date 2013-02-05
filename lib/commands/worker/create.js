/*
 * create.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var assert = require( 'assert' ),
    async = require( 'async' ),
    crosstalkify = require( 'crosstalkify' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    util = require( 'util' ),
    verifyCrosstalkToken = require( '../verifyCrosstalkToken' );

var create = function create ( workerDir, callback ) {

  var app = this;

  async.waterfall([

    function ( _callback ) {
      verifyCrosstalkToken.bind( app )( { workerDir : workerDir }, _callback );
    },

    getWorkerDirectory.bind( app ),

    getWorkerPackage.bind( app ),

    createWorker.bind( app )

  ], function ( error, dataBag ) {

    if ( error ) {

      app.log.error( typeof( error ) == 'object' ?  util.inspect( error ) : error );
      app.log.error( 'Failed to create worker. ' + 'NOT OK'.red );

      return callback( error );

    } // if ( error )

    app.log.info( 'Worker ' + dataBag.response.created.magenta + ' created.' );
    app.log.info( 'Crosstalk ' + 'OK'.green );

    return callback();

  }); // async.waterfall

}; // create

module.exports = create;

var createWorker = function createWorker ( dataBag, callback ) {

  var app = this,
      crosstalkToken = dataBag.crosstalkToken,
      package = dataBag.package;

  assert( crosstalkToken, "missing crosstalkToken" );
  assert( package, "missing package" );

  app.log.info( "Creating worker " + package.name.magenta + '@'.magenta +
    package.version.magenta );

  var bundle = 
         crosstalkify( { directory : path.resolve( dataBag.workerDir ) } );

  var worker = bundle.bundle(); // generate source code

  if ( ! bundle.ok ) return callback( "Failed creating worker" );

  app.api.send.send( 
    crosstalkToken, 
    '~crosstalk.api.worker.create',
    { 
      crosstalkToken : crosstalkToken, 
      package : JSON.stringify( package ),
      worker : worker
    },
    '~crosstalk',
    true,
    function ( error, result ) {

    if ( error ) { return callback( error ); }

    if ( result.error ) { return callback( result.error ); }

    dataBag.response = result.response;

    return callback( null, dataBag );

  }); // app.api.send

}; // createWorker

var getWorkerDirectory = function getWorkerDirectory ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {},
      workerDir = dataBag.workerDir || process.cwd();

  try {

    var package = 
       require( path.resolve( path.join( workerDir, 'package.json' ) ) );

    if ( isCrosstalkWorkerPackage( package ) ) {

      dataBag.workerDir = workerDir;
      return callback( null, dataBag );

    } // if ( isCrosstalkWorkerPackage( package ) )

  } catch ( exception ) {
    // fall through
  }

  app.log.error( 'Unable to find a Crosstalk ' + 'package.json'.magenta +
     ' in ' + ( '' + workerDir ).magenta );
  return getWorkerDirectoryViaPrompt.bind( app )( dataBag, callback );

}; // getWorkerDirectory

var getWorkerDirectoryViaPrompt = function getWorkerDirectoryViaPrompt ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {};

  app.prompt.get( {
    message : 'Path to Crosstalk worker directory',
    name : 'path',
    validator : { 
      test : function ( _path ) {

        try {

          var package = require( path.join( _path, 'package.json' ) );
          return isCrosstalkWorkerPackage( package );

        } catch ( exception ) {
          return false;
        } // catch

      } // test
    }// validator
  }, function ( error, params ) {

    if ( error ) { return callback( error ); }

    dataBag.workerDir = params.path;
    return callback( null, dataBag );

  }); // app.prompt.get 'path'

}; // getWorkerDirectoryViaPrompt

var getWorkerPackage = function getWorkerPackage ( dataBag, callback ) {

  var app = this,
      dataBag = dataBag || {},
      workerDir = dataBag.workerDir;

  try {

    var package = require( path.join( workerDir, 'package.json' ) );

    if ( isCrosstalkWorkerPackage( package ) ) {

      dataBag.package = package;
      return callback( null, dataBag );

    } // if ( isCrosstalkWorkerPackage( package ) )

    // fall through

  } catch ( exception ) {
    // fall through
  }

  app.log.error( 'Unable to find a Crosstalk ' + 'package.json'.magenta +
     ' in ' + ( '' + workerDir ).magenta );
  return callback( new Error( 'Unable to find Crosstalk package.json' ) );

}; // getWorkerPackage

var isCrosstalkWorkerPackage = function isCrosstalkWorkerPackage ( package ) {

  return package && package.crosstalk && package.crosstalk.type == 'worker';

}; // isCrosstalkWorkerPackage