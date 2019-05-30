# Провайдер маяка

```javascript
const name = 'mylighthouse' // название маяка
const stake = 1000 // Wn
​
robonomics.initLighthouse(name)
​
robonomics.xrt.send.approve(robonomics.lighthouse.address, stake, { from: robonomics.account.address })
	.then((tx) => console.log(tx))
​
robonomics.lighthouse.send.refill(stake, { from: robonomics.account.address })
  .then((tx) => console.log(tx))
```
