# Проверить баланс

```javascript
robonomics.xrt.call
  .balanceOf(robonomics.account.address)
  .then(balance => console.log('balance', balance));
```
