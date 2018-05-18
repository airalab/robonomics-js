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
import Robonomics, { Provider } from 'robonomics-js'

const robonomics = new Robonomics({
  provider: new Provider(ipfs)
})
const channel = robonomics.channel('robonomics')

channel.asks(msg => {
  const account = msg.recover()
  console.log(msg, account)
})

channel.bids(msg => {
  const account = msg.recover()
  console.log(msg, account)
})
```

### Доступно

* прослушка канала сообщений спроса и предложения
* отправка сообщения о спросе или предложения в канал
* подписка на событие о появлении нового обязательства

[Подробнее в примерах](/examples)
