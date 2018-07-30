Robonomics-js
========

Простая Javascript библиотека для работы с данными сети Robonomics

## Установка

```
npm install robonomics-js --save
```
или
```
yarn add robonomics-js
```
в браузере
```
<script src="https://cdn.jsdelivr.net/npm/robonomics-js/dist/robonomics.min.js"></script>
```

### Зависимости

* [Web3](https://github.com/ethereum/web3.js/)
* [Ipfs](https://github.com/ipfs/js-ipfs)



### Использование

ES6 import

```javascript
import Robonomics, { MessageProviderIpfsApi } from 'robonomics-js'
import IPFS from 'ipfs-api'

const robonomics = new Robonomics({
  provider: new MessageProviderIpfsApi(new IPFS('localhost', 5001))
})

robonomics.ready().then(() => {
  robonomics.getAsk('lights-out-factory.model.0.robonomics.eth', (msg) => {
    console.log('ask', msg)
  })
  robonomics.getBid('lights-out-factory.model.0.robonomics.eth', (msg) => {
    console.log('bid', msg)
  })
})
```

### Доступно

* прослушка канала сообщений спроса и предложения
* отправка сообщения о спросе или предложения в канал
* подписка на событие о появлении нового обязательства
