import Robonomics, { MessageProviderIpfs } from 'robonomics-js';

const ipfs = new MessageProviderIpfs(new Ipfs({
  repo: 'ipfs/robonomics',
  relay: {
    enabled: true,
    hop: {
      enabled: true
    }
  },
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        '/dns4/1.wsstar.aira.life/tcp/443/wss/p2p-websocket-star/',
        '/dns4/2.wsstar.aira.life/tcp/443/wss/p2p-websocket-star/'
      ]
    },
    Bootstrap: [
      '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
      '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
      '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
      '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
      '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
      '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
      '/dns4/1.pubsub.aira.life/tcp/443/wss/ipfs/QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8',
      '/dns4/2.pubsub.aira.life/tcp/443/wss/ipfs/QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9'
    ]
  }
}));
const web3 = new Web3(window.ethereum) // metamask || const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) // local

const robonomics = new Robonomics({
  web3: web3,
  account: {
    address: web3.eth.accounts[0]
  },
  messageProvider: ipfs,
  lighthouse: 'airalab.lighthouse.5.robonomics.eth'
})

robonomics.ready().then(() => {
  console.log('xrt', robonomics.xrt.address);
  console.log('factory', robonomics.factory.address);
  console.log('lighthouse', robonomics.lighthouse.address);

  const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg';

  robonomics.onDemand(model, msg => {
    console.log('demand', msg);
  });

  robonomics.onOffer(model, msg => {
    console.log('offer', msg);
  });

  robonomics.onResult(msg => {
    console.log('result', msg);
  });

  const demand = {
    model: model,
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    lighthouse: robonomics.lighthouse.address,
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999
  };
  robonomics.sendDemand(demand).then(liability => {
    console.log('liability', liability.address);
  });

  const offer = {
    model: model,
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    lighthouse: robonomics.lighthouse.address,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouseFee: 0,
    deadline: 9999999
  };
  robonomics.sendOffer(offer).then(liability => {
    console.log('liability', liability.address);
  });

  robonomics.onLiability(liability => {
    console.log('liability', liability.address);
  });

  robonomics.sendResult({
    liability: liability.address,
    success: true,
    result: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M'
  });

  robonomics.ens.addr('airalab.lighthouse.0.robonomics.eth').then(address => {
    console.log('address', address);
  });

  robonomics.xrt.call.balanceOf('0x123..........').then(balance => {
    console.log('balance', balance);
  });

  robonomics.xrt.send
    .approve(robonomics.factory.address, 100000, {
      from: robonomics.account
    })
    .then(receipt => {
      console.log('tx', receipt);
    });

  robonomics.xrt.send
    .approve(robonomics.factory.address, 100000, {
      from: robonomics.account
    })
    .then(receipt => {
      console.log('tx', receipt);
    });
});
