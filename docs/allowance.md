# Проверить кол-во одобренных токенов

```javascript
robonomics.xrt.call
  .allowance(robonomics.account.address, robonomics.factory.address)
  .then(allowance => console.log('allowance', allowance));
```
