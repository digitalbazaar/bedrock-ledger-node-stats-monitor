/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {util: {uuid}} = bedrock;
require('bedrock-mongodb');
require('bedrock-stats');
require('bedrock-stats-storage-redis');
require('bedrock-ledger-node-stats-monitor');
require('bedrock-ledger-node');
require('bedrock-ledger-consensus-continuity');
require('bedrock-ledger-consensus-continuity-es-most-recent-participants');
require('bedrock-ledger-context');
const mockData = require('./mocha/mock.data');

// a mock continuity consensus stats module
bedrock.events.on(
  'bedrock-ledger-node-stats-monitor.report.consensus',
  async ({_createdDate, ledgerNode, monitors}) => {
    const {id: ledgerNodeId} = ledgerNode;
    const continuity = {
      ledgerNodeId,
      stat1: uuid()
    };
    monitors.continuity = continuity;

    // generate mock report data
    const mockReport = {
      createdDate: _createdDate,
      monitors: {}
    };
    mockReport.monitors[`ledgerNode-${ledgerNodeId}-consensus`] = {continuity};
    if(mockData.reports.set1[ledgerNodeId]) {
      return mockData.reports.set1[ledgerNodeId].push(mockReport);
    }
    mockData.reports.set1[ledgerNodeId] = [mockReport];
  });

require('bedrock-test');
bedrock.start();
