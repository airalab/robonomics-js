[<img src="https://raw.githubusercontent.com/airalab/robonomics-js/master/1_XRT.png" align="center" height="150" width="150"/>](https://robonomics.network/)

# Robonomics-js

[![NPM Version](https://img.shields.io/npm/v/robonomics-js.svg?style=flat)](https://www.npmjs.com/package/robonomics-js)
[![Build Status](https://travis-ci.org/airalab/robonomics-js.svg?branch=master)](https://travis-ci.org/airalab/robonomics-js)

Простая Javascript библиотека для работы с данными сети Robonomics

## Установка

Установка выполняется с помощью [npm](https://www.npmjs.com/). Чтобы установить, запустите:

```bash
> npm install robonomics-js --save
```

Или с помощью [yarn](https://yarnpkg.com/). Чтобы установить, запустите:

```bash
> yarn add robonomics-js
```

### Зависимости

- [Web3.js](https://github.com/ethereum/web3.js/) version 0.20.7
- [Ipfs](https://github.com/ipfs/js-ipfs) version 0.34.0

## Использование

Создает и возвращает экземпляр Robonomics.

```js
const options = {...};
const robonomics = new Robonomics(options);
```

### `options`

Это объект свойств:

`options.web3`

Это экземпляр [web3.js](https://github.com/ethereum/web3.js/)

```js
// metamask
const options = {
  web3: new Web3(window.ethereum),
  ...
};

// infura
const options = {
  web3: new Web3.providers.HttpProvider("https://mainnet.infura.io/"),
  ...
};
```

`options.messageProvider`

Это экземпляр MessageProviderIpfs, который использует узел [js-ipfs](https://github.com/ipfs/js-ipfs) с включеной опцией pubsub.

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

Это объект свойств аккаунта, которым будут подписываться сообщения.
Необходимо указать либо адрес аккаунта (предварительно аккаунт должен быть разблокирован), либо приватный ключь (адрес будет востановлен из ключа).

Параметр `isSignPrefix` опрелеляет довавлять префикс или нет для подписи сообщения. По умолчанию `true`.

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

Это объект свойств контракта ens. Этот параметр не обязателен.
При необходимости можно указать адрес `address` контракта если используется не mainnet.
Суффикс `suffix` для имен, для `sidechain` этот суффикс `sid`, по умолчанию `eth`.
Версия `version` сети робономики, по умолчанию актуальная последняя версия.

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

ENS имя маяка, параметр не обязательный, по умолчанию указан `airalab.lighthouse.5.robonomics.eth`.
Полное имя указывать не обязательно, можно указать только название, например `airalab`.

```js
const options = {
  lighthouse: 'airalab.lighthouse.5.robonomics.eth',
  ...
};
```

Перед использованием необходимо дождаться инициальзации всех компонентов.

```js
const options = {...};
const robonomics = new Robonomics(options);
robonomics.ready().then(() => {
  console.log('Robonomics instance ready')
})
```

## API

### Сообщения

#### Спрос

Фотмат сообщения.

```js
const demand = {
  // ОБЯЗАТЕЛЬНЫЕ параметры
  model: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M', // модель в виде ipfs хеша на rosbag файл
  objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf2M', // задача в виде ipfs хеша на rosbag файл
  token: robonomics.xrt.address, // адрес токена для оплата
  cost: 1, // стоимость
  deadline: 9999999, // номер блока после которого спрос будет не действителен

  // НЕ ОБЯЗАТЕЛЬНЫЕ параметры
  lighthouse: '0x0000000000000000000000000000000000000000', // адрес маяка, по умолчанию указан адрес маяка при инициализации
  validator: '0x0000000000000000000000000000000000000000', // адрес валидатора, если требуется проверка результата
  validatorFee: 0, // комиссия валидатора
  nonce: 1 // порядковый номер
};
```

`robonomics.sendDemand`

Подпись и отправка сообщения спроса. В качестве результата получаем обязательство.

```js
robonomics.sendDemand(demand).then(liability => {
  console.log(liability.address);
});
```

`robonomics.onDemand`

Слушает сообщения с спросом по указаной модели в качестве первого параметра.
Если первым параметром указать `null`, то будут получены все сообщения спроса на маяке.

```js
robonomics.onDemand(model, message => {
  console.log(message);
});
```

#### Предложение

Фотмат сообщения.

```js
const offer = {
  // ОБЯЗАТЕЛЬНЫЕ параметры
  model: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M', // модель в виде ipfs хеша на rosbag файл
  objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf2M', // задача в виде ipfs хеша на rosbag файл
  token: robonomics.xrt.address, // адрес токена для оплата
  cost: 1, // стоимость
  deadline: 9999999, // номер блока после которого спрос будет не действителен

  // НЕ ОБЯЗАТЕЛЬНЫЕ параметры
  lighthouse: '0x0000000000000000000000000000000000000000', // адрес маяка, по умолчанию указан адрес маяка при инициализации
  lighthouseFee: 0, // комиссия маяка
  validator: '0x0000000000000000000000000000000000000000', // адрес валидатора, если требуется проверка результата
  nonce: 1 // порядковый номер
};
```

`robonomics.sendOffer`

Подпись и отправка сообщения предложения. В качестве результата получаем обязательство.

```js
robonomics.sendOffer(offer).then(liability => {
  console.log(liability.address);
});
```

`robonomics.onOffer`

Слушает сообщения с предложениями по указаной модели в качестве первого параметра.
Если первым параметром указать `null`, то будут получены все сообщения предложений на маяке.

```js
robonomics.onOffer(model, message => {
  console.log(message);
});
```

#### Результат

Фотмат сообщения.

```js
const result = {
  // ОБЯЗАТЕЛЬНЫЕ параметры
  liability: '0x0000000000000000000000000000000000000000', // адрес контракта обязательства
  success: true, // признак результата работы
  result: 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg' // результат в виде ipfs хеша на rosbag файл
};
```

`robonomics.sendResult`

Подпись и отправка сообщения предложения.

```js
robonomics.sendResult(result).then(() => {
  console.log('ok');
});
```

`robonomics.onResult`

Слушает сообщения с результатами в сети. Результат в этих сообщениях нельзя считать валидным. Валидный результат нужно получать из контракта обязательства

```js
robonomics.onResult(result => {
  console.log(result);
});
```

### Контракты

#### Обязательство

`liability.getInfo`

Вернет объект всех свойств контракта.

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

Ожидает закрытия контрата, вернет результат.

```js
liability.onResult().then(result => {
  console.log(result);
});
```

#### Маяк

`robonomics.lighthouse.getInfo`

Вернет объект всех свойств контракта.

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

Вернет список адресов провайдеров работающих на маяке.

```js
robonomics.lighthouse.getProviders().then(list => {
  console.log(list);
});
```

##### Создание нового маяка

```js
const minimalFreeze = 1000 // Wn
const timeout = 25 // blocks
const name = 'mylighthouse' // название маяка
robonomics.factory.send.createLighthouse(minimalFreeze, timeout, name, { from: robonomics.account.address })
    .then((tx) => console.log(tx))
​
robonomics.factory.onLighthouse((lighthouse) => {
    console.log(lighthouse.name)
})
```

##### Стать провайдером маяка

Предварительно необходимо выполнить `approve` токенов `XRT`

```js
const name = 'mylighthouse'; // название маяка
const stake = 1000; // Wn
robonomics.lighthouse.send
  .refill(stake, { from: robonomics.account.address })
  .then(tx => console.log(tx));
```

#### Токен

`robonomics.xrt.getInfo`

Вернет объект всех свойств контракта.

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

##### Проверить баланс

```js
robonomics.xrt.call
  .balanceOf(robonomics.account.address)
  .then(balance => console.log(balance));
```

##### Проверить кол-во одобренных токенов на адрес фабрики

```js
robonomics.xrt.call
  .allowance(robonomics.account.address, robonomics.factory.address)
  .then(allowance => console.log(allowance));
```

##### Approve токенов на адрес маяка

```js
robonomics.xrt.send
  .approve(robonomics.lighthouse.address, 100, {
    from: robonomics.account.address
  })
  .then(tx => console.log(tx));
```

## Ссылки

- [Сайт](https://robonomics.network/)
- [Документация](https://aira.readthedocs.io/)
- [Минимальный шаблон dApp](https://github.com/airalab/vue-dapp-robonomics-template)
- [Пример dApp](https://codesandbox.io/embed/robonomics-vue-template-bgipo)
