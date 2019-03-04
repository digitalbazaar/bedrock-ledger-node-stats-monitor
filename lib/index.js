/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brLedgerNode = require('bedrock-ledger-node');
const {config} = bedrock;
require('bedrock-stats');

require('./config');
const cfg = config['ledger-node-stats-monitor'];

bedrock.events.on('bedrock-stats.report', async ({_createdDate, monitors}) => {
  const nodeIterator = await brLedgerNode.getNodeIterator(null);
  for(const promise of nodeIterator) {
    const ledgerNode = await promise;
    const {id: ledgerNodeId} = ledgerNode;
    for(const metric in cfg.metrics) {
      const metricReport = {};
      await bedrock.events.emit(
        `bedrock-ledger-node-stats-monitor.report.${metric}`, {
          _createdDate,
          ledgerNode,
          monitors: metricReport
        });
      const monitorId = `ledgerNode-${ledgerNodeId}-${metric}`;
      monitors[monitorId] = metricReport;
    }
  }
});
