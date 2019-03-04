/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const brLedgerNode = require('bedrock-ledger-node');
const brStatsStorageRedis = require('bedrock-stats-storage-redis');
const mockData = require('./mock.data');

describe('ledger-node-stats-monitor', () => {
  let ledgerNodeIds;
  before(async () => {
    let error;
    try {
      ({ledgerNodeIds} = await _initLedger({peerCount: 6}));
    } catch(e) {
      error = e;
    }
    assertNoError(error);
  });
  it('stores two seconds of monitor reports for seven nodes', async () => {
    await sleep(2000);
    for(const ledgerNodeId of ledgerNodeIds) {
      const result = await brStatsStorageRedis.find({monitorIds: [
        `ledgerNode-${ledgerNodeId}-consensus`
      ]});
      result.should.eql(mockData.reports.set1[ledgerNodeId]);
    }
  });
});

async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function _initLedger({peerCount = 0}) {
  const ledgerNodeIds = [];
  brLedgerNode.use('Continuity2017');
  const ledgerConfiguration = mockData.ledgerConfiguration;
  const genesisNode = await brLedgerNode.add(null, {ledgerConfiguration});
  ledgerNodeIds.push(genesisNode.id);

  if(peerCount === 0) {
    return;
  }

  const {genesisBlock: {block: genesisBlock}} =
    await genesisNode.blocks.getGenesis();
  for(let i = 0; i < peerCount; ++i) {
    const ledgerNode = await brLedgerNode.add(null, {genesisBlock});
    ledgerNodeIds.push(ledgerNode.id);
  }
  return {ledgerNodeIds};
}
