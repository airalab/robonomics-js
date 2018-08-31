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
