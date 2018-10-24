Спрос
========

Получаем весь приходящий спрос на маяк, по выбранной модели

```javascript
const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg'
robonomics.getDemand(model, (msg) => {
	console.log(msg)
})
const demand = {
	objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
	token: robonomics.xrt.address,
	cost: 1,
	deadline: 9999999
}
```

Допустимые поля

 - objective - задача в виде ipfs хеша на rosbag файл

 - token - адрес токена для оплата

 - cost - стоимость

 - validator - адрес валидатора

 - validatorFee - комиссия валидатора

 - deadline - номер блока после которого спрос будет не действителен

Предварительно нужно одобрить необходимое кол-во токенов

```javascript
robonomics.xrt.send('approve', [robonomics.factory.address, demand.cost], { from: robonomics.account })
  .then((tx) => console.log(tx))
```

Если токен, которым оплачивается работа кфс не xrt

```javascript
import { Token } from 'robonomics-js'
const token = new Token(robonomics.web3, '0x1231321321321321321321321')
token.send('approve', [robonomics.factory.address, demand.cost], { from: robonomics.account })
  .then((tx) => console.log(tx))
```
Отправляем сообщение спроса

```javascript
robonomics.postDemand(market, demand)
	.then((liability) => {
		console.log('liability', liability.address)
		liability.watchResult((result) => {
			console.log('liability result', result)
		})
		return liability.getInfo()
	})
	.then((info) => {
		console.log('liability info', info)
    })
```
