# Предложение

Получаем все приходящие сообщения предложений на маяк, по выбранной модели

```javascript
const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg';
robonomics.onOffer(model, msg => {
  console.log(msg);
});
const offer = {
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

- validator - адрес валидатора

- lighthouse - адрес маяка

- lighthouseFee - комиссия маяка

- deadline - номер блока после которого спрос будет не действителен

- nonce - порядковый номер

Отправляем сообщение предложения

```javascript
robonomics
  .sendOffer(offer)
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
