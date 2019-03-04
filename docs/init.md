# Инициализация

```javascript
import Robonomics, { MessageProviderIpfsApi } from 'robonomics-js'
import IPFS from 'ipfs-api'
​
const robonomics = new Robonomics({
	messageProvider: new MessageProviderIpfsApi(new IPFS('http://localhost:5001')),
  lighthouse: 'airalab'
})
​
robonomics.ready().then(() => {
	console.log('robonomics js ready')
	console.log('xrt', robonomics.xrt.address)
	console.log('factory', robonomics.factory.address)
	console.log('lighthouse default', robonomics.lighthouse.address)
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
		version, (используемая версия, по умолчанию последняя)
		address, (адрес ENS, по умолчанию указан 0x314159265dD8dbb310642f98f50C066173C1259b из сети mainnet)
		suffix (по умолчанию eth)
	},
  lighthouse (ens название маяка, по умолчанию airalab.lighthouse.0.robonomics.eth)
}
```
