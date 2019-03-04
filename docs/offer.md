# Предложение

Получаем все приходящие сообщения предложений на маяк, по выбранной модели

```javascript
const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg';
robonomics.onOffer(model, msg => {
  console.log(msg);
});
```

Допустимые поля

- model -модель в виде ipfs хеша на rosbag файл

- objective - задача в виде ipfs хеша на rosbag файл

- token - адрес токена для оплата

- cost - стоимость

- validator - адрес валидатора

- lighthouse - адрес маяка

- lighthouseFee - комиссия маяка

- deadline - номер блока после которого спрос будет не действителен
