# Проверить кол-во одобренных токенов

```javascript
robonomics.xrt.call
  .allowance(robonomics.account, robonomics.factory.address)
  .then(allowance => console.log('allowance', allowance));
```
