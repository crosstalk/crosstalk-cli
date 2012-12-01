/*
 * account.js: Crosstalk account commands
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

exports.usage = [
  '`crosstalk account *` commands enable you to interact with your ' + 
    'Crosstalk account.',
  'Valid commands are:',
  '',
  'crosstalk account available ACCOUNT_NAME',
  'crosstalk account create ACCOUNT_NAME',
  ''
];

exports.activate = require( './account/activate' );

exports.activate.usage = [
  'Activates the ACCOUNT_NAME account',
  '',
  'crosstalk account activate [ACCOUNT_NAME] [ACTIVATION_TOKEN]',
  ''
];

exports.available = require( './account/available' );

exports.available.usage = [
  'Checks if the ACCOUNT_NAME is available',
  '',
  'crosstalk account available [ACCOUNT_NAME]',
  ''
];

//
// ### function create ()
// Gathers account information from the user.
// Checks if the account name is available.
// If the account name is available, creates the account.
//
exports.create = require( './account/create' );

exports.create.usage = [
  'Creates a Crosstalk account',
  '',
  'crosstalk account create [ACCOUNT_NAME]',
  ''
];