# Спрос

Получаем весь приходящий спрос на маяк, по выбранной модели

```javascript
const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg';
robonomics.onDemand(model, msg => {
  console.log(msg);
});
const demand = {
  model: model,
  objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
  token: robonomics.xrt.address,
  cost: 1,
  deadline: 9999999
};
```

Допустимые поля

- model - модель в виде ipfs хеша на rosbag файл

- objective - задача в виде ipfs хеша на rosbag файл

- token - адрес токена для оплата

- cost - стоимость

- lighthouse - адрес маяка

- validator - адрес валидатора

- validatorFee - комиссия валидатора

- deadline - номер блока после которого спрос будет не действителен

- nonce - порядковый номер

Предварительно нужно одобрить необходимое кол-во токенов

```javascript
robonomics.xrt.send
  .approve(robonomics.factory.address, demand.cost, {
    from: robonomics.account.address
  })
  .then(receipt => console.log(receipt));
```

Если токен, которым оплачивается работа кфс не xrt

```javascript
import { Token } from 'robonomics-js';
const token = new Token(robonomics.web3, '0x1231321321321321321321321');
token.send
  .approve(robonomics.factory.address, demand.cost, {
    from: robonomics.account.address
  })
  .then(receipt => console.log(receipt));
```

Отправляем сообщение спроса

```javascript
robonomics
  .sendDemand(demand)
  .then(liability => {
    console.log('liability', liability.address);
    liability.onResult(result => {
      console.log('liability result', result);
    });
    return liability.getInfo();
  })
  .then(info => {
    console.log('liability info', info);
  });
```
