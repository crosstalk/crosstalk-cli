/*
 * worker.js: Crosstalk worker commands
 *
 * (C) 2012 Crosstalk Systems Inc.
 */

exports.usage = [
  '`crosstalk worker *` commands enable you to interact with your Crosstalk ' +
    'workers.',
  'Valid commands are:',
  '',
  'crosstalk worker create [PATH_TO_WORKER]',
  'crosstalk worker list',
  'crosstalk worker running',
  'crosstalk worker start [WORKER@VERSION]',
  'crosstalk worker stop [WORKER_INSTANCE]',
  ''
];

exports.create = require( './worker/create' );

exports.create.usage = [
  'Creates a new worker with specified version.',
  '',
  'crosstalk worker create [PATH_TO_WORKER]',
  ''
];

exports.list = require( './worker/list' );

exports.list.usage = [
  'Lists uploaded workers.',
  '',
  'crosstalk worker list',
  ''
];

exports.running = require( './worker/running' );

exports.running.usage = [
  'Lists currently running workers.',
  '',
  'crosstalk worker running',
  ''
];

exports.start = require( './worker/start' );

exports.start.usage = [
  'Starts a worker.',
  '',
  'crosstalk worker start [WORKER@VERSION]',
  ''
];

exports.stop = require( './worker/stop' );

exports.stop.usage = [
  'Stops a worker instance.',
  '',
  'crosstalk worker stop [WORKER_INSTANCE]',
  ''
];