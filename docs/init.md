# Инициализация

```javascript
import Robonomics, { MessageProviderIpfs } from 'robonomics-js'
import Ipfs from 'ipfs'
​
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
​
robonomics.ready().then(() => {
	console.log('robonomics js ready')
	console.log('xrt', robonomics.xrt.address)
	console.log('factory', robonomics.factory.address)
	console.log('lighthouse', robonomics.lighthouse.address)
})
```

## Доступные параметры при инициалицации Robonomics

```
{
  web3,
  messageProvider, (провайдер обмена сообщениями, в текущей версии используется ipfs)
  account: {
    address, (если указан приватный ключ параметр не обязателен)
    privateKey, (приватный ключ параметр не обязателен)
    isSignPrefix (довавлять префикс или нет)
  },
  ens: {
		version, (по умолчанию используемая последняя версия)
		address, (адрес ENS, по умолчанию указан 0x314159265dD8dbb310642f98f50C066173C1259b из сети mainnet)
		suffix (по умолчанию eth)
	},
  lighthouse (ens название маяка, по умолчанию airalab.lighthouse.5.robonomics.eth)
}
```
