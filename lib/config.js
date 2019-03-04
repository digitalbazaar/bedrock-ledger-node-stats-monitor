/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');

const cfg = config['ledger-node-stats-monitor'] = {};

cfg.metrics = {
  consensus: true,
};
