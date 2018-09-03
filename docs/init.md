Инициализация
========

```javascript
import Robonomics, { MessageProviderIpfsApi } from 'robonomics-js'
import IPFS from 'ipfs-api'
​
const robonomics = new Robonomics({
	provider: new MessageProviderIpfsApi(new IPFS('http://localhost:5001'))
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

 - web3 (если используется в браузере например metamask, то этот параметр не обязателен, тк web3 будет доступен глобально)
 - account (если используется в браузере например metamask, то этот параметр не обязателен)
 - privateKey (приватный ключ параметр не обязателен)
 - provider (провайдер обмена сообщениями, в текущей версии используется ipfs)
 - version (используемая версия, по умолчанию последняя)
 - ens (адрес ENS, по умолчанию указан 0x314159265dD8dbb310642f98f50C066173C1259b из сети mainnet)
 - lighthouse (ens название маяка, по умолчанию airalab.lighthouse.0.robonomics.eth)
