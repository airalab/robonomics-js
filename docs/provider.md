Провайдер маяка
========

```javascript
const name = 'mylighthouse' // название маяка
const stake = 1000 // Wn
​
robonomics.setLighthouse(name)
​
robonomics.xrt.send('approve', [robonomics.lighthouse.address, stake], { from: robonomics.account })
	.then((tx) => console.log(tx))
​
robonomics.lighthouse.send('refill', [stake], { from: robonomics.account })
  .then((tx) => console.log(tx))
```
