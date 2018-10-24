Предложение
========

Получаем все приходящие сообщения предложений на маяк, по выбранной модели

```javascript
const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg'
robonomics.getOffer(model, (msg) => {
	console.log(msg)
})
```

Допустимые поля

 - objective - задача в виде ipfs хеша на rosbag файл

 - token - адрес токена для оплата

 - cost - стоимость

 - lighthouseFee - комиссия маяка

 - deadline - номер блока после которого спрос будет не действителен
