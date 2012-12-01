/*
 * index.js
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

var crosstalkApiClient = require( 'crosstalk-api-client' ),
    flatiron = require( 'flatiron' ),
    path = require( 'path' ),
    app = flatiron.app;

app.version = require( path.join( __dirname, 'package.json' ) ).version;

app.config.file( { file : path.join( __dirname, 'config', 'config.json' ) } );

app.use( flatiron.plugins.cli, {

  dir : path.join( __dirname, 'lib', 'commands' ),
  usage : [
    'Crosstalk CLI',
    'Valid commands are:',
    '',
    'crosstalk signup',
    'crosstalk activate',
    'crosstalk account *',
    'crosstalk login [ACCOUNT_NAME]',
    'crosstalk logout',
    'crosstalk version',
    'crosstalk worker *',
    ''
  ],
  version : true

}); // app.use flatiron.plugins.cli

app.alias( 'activate', { resource : 'account', command : 'activate' } );
app.alias( 'signup', { resource : 'account', command : 'create' } );

app.api = {};
app.api.accounts = new ( crosstalkApiClient.Accounts )( app.config.get( 'api' ) );
app.api.login = new ( crosstalkApiClient.Login )( app.config.get( 'api' ) );
app.api.logout = new ( crosstalkApiClient.Logout )( app.config.get( 'api' ) );
app.api.send = new ( crosstalkApiClient.Send )( app.config.get( 'send' ) );
app.api.version = new ( crosstalkApiClient.Version )( app.config.get( 'api' ) );

app.start( function () {
  process.exit( 0 );
});