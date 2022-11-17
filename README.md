[<img src="https://raw.githubusercontent.com/airalab/robonomics-js/master/1_XRT.png" align="center" height="150" width="150"/>](https://robonomics.network/)

# Robonomics-js

[![NPM Version](https://img.shields.io/npm/v/robonomics-js.svg?style=flat)](https://www.npmjs.com/package/robonomics-js)
[![Build Status](https://travis-ci.org/airalab/robonomics-js.svg?branch=master)](https://travis-ci.org/airalab/robonomics-js)

Simple Javascript library to work with Robonomcis on Ethereum data

## Install

Installation is performed via [npm](https://www.npmjs.com/). To install, run:

```bash
> npm install robonomics-js --save
```

Or with [yarn](https://yarnpkg.com/). To install, run:

```bash
> yarn add robonomics-js
```

### Dependencies

- [Web3.js](https://github.com/ethereum/web3.js/) version 1.2.4
- [Ipfs](https://github.com/ipfs/js-ipfs) version 0.34.0

## Use

Create and return an instance of Robonomics.

```js
const options = {...};
const robonomics = new Robonomics(options);
```

### `options`

This is a properties object:

`options.web3`

That's an instance of [web3.js](https://github.com/ethereum/web3.js/)

```js
// metamask
const options = {
  web3: new Web3(window.ethereum),
  ...
};

// infura
const options = {
  web3: new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://mainnet.infura.io/ws/v3/0b2f2a5026264b57b6d698b480332e89"
    )
  ),
  ...
};
```

`options.messageProvider`

That's an instance of MessageProviderIpfs, which uses the node of [js-ipfs](https://github.com/ipfs/js-ipfs) with `pubsub` option enabled.

```js
const ipfs = new Ipfs({
  repo: 'robonomics-example',
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
        '/dns4/2.wsstar.aira.life/tcp/443/wss/p2p-websocket-star/',
        '/dns4/3.wsstar.aira.life/tcp/443/wss/p2p-websocket-star/'
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
      '/dns4/2.pubsub.aira.life/tcp/443/wss/ipfs/QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9',
      '/dns4/3.pubsub.aira.life/tcp/443/wss/ipfs/QmWZSKTEQQ985mnNzMqhGCrwQ1aTA6sxVsorsycQz9cQrw'
    ]
  }
})

const options = {
  messageProvider: new MessageProviderIpfs(ipfs),
  ...
};
```

`options.account`

This is an object of account's properties, the account to sing messages with.
Pass either an account's address (it should be unlocked in prior), or teh account's private key (account's address will be derived out of the key).

`isSignPrefix` is responsible for adding a prefix to the message. Defaults to `true`.

```js
const options = {
  account: {
    address: '0x0000000000000000000000000000000000000000',
    privateKey: '0x0000000000000000000000000000000000000000000000000000',
    isSignPrefix: true
  },
  ...
};
```

`options.ens`

This is a properties object of the ens contract. The parameter is optional.
If necessary, set `address` of the contract (if using other than mainnet network).
Suffix `suffix` for names, defaults to `eth`, for any `sidechain` it's `sid`.
Version `version` of Robonomics network, defaults to the latest one.

```js
const options = {
  ens: {
    address: '0x314159265dD8dbb310642f98f50C066173C1259b',
    suffix: 'eth',
    version: 5
  },
  ...
};
```

`options.lighthouse`

ENS lighthouse name, optional, defaults to `airalab.lighthouse.5.robonomics.eth`.
It's possible to set the short name only: `airalab`.

```js
const options = {
  lighthouse: 'airalab.lighthouse.5.robonomics.eth',
  ...
};
```

Wait for components initialization before use.

```js
const options = {...};
const robonomics = new Robonomics(options);
robonomics.ready().then(() => {
  console.log('Robonomics instance ready')
})
```

## API

### Messages

#### Demand

Message format.

```js
const demand = {
  // Required
  model: "QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M", // model as an IPFS CID to a rosbag file
  objective: "QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf2M", // task as an IPFS CID to a rosbag file
  token: robonomics.xrt.address, // payment token address
  cost: 1, // cost
  deadline: 9999999, // deadline block number

  // Optional
  lighthouse: "0x0000000000000000000000000000000000000000", // lighthouse address, defaults to the one set at initialization
  validator: "0x0000000000000000000000000000000000000000", // validator address in case proof of work needed
  validatorFee: 0, // validator fee
  nonce: 1 // nonce
};
```

`robonomics.sendDemand`

Sign and send the demand. Returns liability.

```js
robonomics.sendDemand(demand).then(liability => {
  console.log(liability.address);
});
```

`robonomics.onDemand`

Listens to demand messages for a passed model. If set model to `null`, listens to all the demands on a lighthouse.

```js
robonomics.onDemand(model, message => {
  console.log(message);
});
```

#### Offer

Message format.

```js
const offer = {
  // Required
  model: "QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M", // model as an IPFS CID to a rosbag file
  objective: "QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf2M", // task as an IPFS CID to a rosbag file
  token: robonomics.xrt.address, // payment token address
  cost: 1, // cost
  deadline: 9999999, // deadline block number

  // Optional
  lighthouse: "0x0000000000000000000000000000000000000000", // lighthouse address, defaults to the one set at initialization
  lighthouseFee: 0, // lighthouse fee
  validator: "0x0000000000000000000000000000000000000000", // validator address in case proof of work needed
  nonce: 1 // nonce
};
```

`robonomics.sendOffer`

Sign and send the offer. Returns liability.

```js
robonomics.sendOffer(offer).then(liability => {
  console.log(liability.address);
});
```

`robonomics.onOffer`

Listens to offer messages for a passed model. If set model to `null`, listens to all the offers on a lighthouse.

```js
robonomics.onOffer(model, message => {
  console.log(message);
});
```

#### Result

Message format.

```js
const result = {
  // Required
  liability: "0x0000000000000000000000000000000000000000", // liability contract address
  success: true, // job success flag
  result: "QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg" // Result as an IPFS CID to a rosbag file
};
```

`robonomics.sendResult`

Sign and send offer message.

```js
robonomics.sendResult(result).then(() => {
  console.log("ok");
});
```

`robonomics.onResult`

Listens to result messages in the network. Result is not supposed as valid. Valid result is to be obtained from the liability.

```js
robonomics.onResult(result => {
  console.log(result);
});
```

### Contracts

#### Liability

`liability.getInfo`

Returns an object of contract properties.

```js
liability.getInfo().then(data => {
  console.log(data);
  /*
  {
    model,
    objective,
    result,
    token,
    cost,
    lighthouseFee,
    validatorFee,
    demandHash,
    offerHash,
    promisor,
    promisee,
    lighthouse,
    validator,
    isSuccess,
    isFinalized
  }
  */
});
```

`liability.onResult`

Waits for the contract to complete, returns result.

```js
liability.onResult().then(result => {
  console.log(result);
});
```

#### Lighthouse

`robonomics.lighthouse.getInfo`

Returns an object of contract properties.

```js
robonomics.lighthouse.getInfo().then(data => {
  console.log(data);
  /*
  {
    minimalStake,
    timeoutInBlocks,
    keepAliveBlock,
    marker,
    quota
  }
  */
});
```

`robonomics.lighthouse.getProviders`

Returns a list of provides working on a lighthouse.

```js
robonomics.lighthouse.getProviders().then(list => {
  console.log(list);
});
```

##### Create a new lighthouse

```js
const minimalFreeze = 1000 // Wn
const timeout = 25 // blocks
const name = 'mylighthouse' // lighthouse name
robonomics.factory.methods.createLighthouse(minimalFreeze, timeout, name).send({ from: robonomics.account.address })
    .then((tx) => console.log(tx))
​
robonomics.factory.onLighthouse((lighthouse) => {
    console.log(lighthouse.name)
})
```

##### Become a lighthouse provider

First, XRT tokens approve needed:

```js
const name = "mylighthouse"; // lighthouse name
const stake = 1000; // Wn
robonomics.lighthouse.methods
  .refill(stake)
  .send({ from: robonomics.account.address })
  .then(tx => console.log(tx));
```

#### Token

`robonomics.xrt.getInfo`

Returns an object of contract properties.

```js
robonomics.xrt.getInfo().then(data => {
  console.log(data);
  /*
  {
    name,
    totalSupply,
    decimals,
    symbol
  }
  */
});
```

##### Check balance

```js
robonomics.xrt.methods
  .balanceOf(robonomics.account.address)
  .call()
  .then(balance => console.log(balance));
```

##### Check number of approved tokens for the factory by its address

```js
robonomics.xrt.methods
  .allowance(robonomics.account.address, robonomics.factory.address)
  .call()
  .then(allowance => console.log(allowance));
```

##### Approve tokens for the lighthouse address

```js
robonomics.xrt.methods
  .approve(robonomics.lighthouse.address, 100)
  .send({
    from: robonomics.account.address
  })
  .then(tx => console.log(tx));
```

## Links

- [Robonomics Network](https://robonomics.network/)
- [Docs](https://aira.readthedocs.io/)
- [Basic DApp template](https://github.com/airalab/vue-dapp-robonomics-template)
- [DApp example](https://codesandbox.io/s/robonomics-vue-template-ewuiw)

[![Edit Robonomics Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/robonomics-vue-template-ewuiw?fontsize=14&hidenavigation=1&theme=dark)
