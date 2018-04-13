Aira-js
========

Простая Javascript библиотека для работы с данными сети Robonomics

## Установка

```
npm install aira-js --save
```
или
```
yarn add aira-js
```

### Зависимости

* [Web3](https://github.com/ethereum/web3.js/)
* [Ipfs](https://github.com/ipfs/js-ipfs)



### Использование

ES6 import

```javascript
import Aira, { Provider } from 'aira-js'

const aira = new Aira({
  provider: new Provider(ipfs)
})
const chanel = aira.chanel('aira_market')

chanel.asks(msg => {
  const account = msg.recover()
  console.log(msg, account)
})

chanel.bids(msg => {
  const account = msg.recover()
  console.log(msg, account)
})
```

### Доступно

* прослушка канала сообщений спроса и предложения
* отправка сообщения о спросе или предложения в канал
* подписка на событие о появлении нового обязательства

[Подробнее в примерах](/examples)
