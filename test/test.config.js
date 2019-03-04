/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));

config.ledger.jobs.scheduleConsensusWork = true;

// MongoDB
config.mongodb.name = 'bedrock_ledger_node_test';
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

const cfg = config['stats'];
// generate reports at this interval in ms
cfg.report.interval = 100;
cfg.storage.push({name: 'redis'});
cfg.storage.push({name: 'bedrock-logger'});
