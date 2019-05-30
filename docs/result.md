# Результат

Получаем все приходящие сообщения результата на маяк, по выбранной модели

```javascript
robonomics.onResult(msg => {
  console.log(msg);
});

robonomics
  .sendResult({
    liability: '',
    success: true,
    result: 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg'
  })
  .then(() => {
    console.log('ok');
  });
```

Допустимые поля

- liability - адрес контракта обязательства

- success - признак результата работы

- result - результат в виде ipfs хеша на rosbag файл

Результат в этих сообщениях нельзя считать валидным.
Валидный результат нужно получать из контракта обязательства

```javascript
liability.onResult(result => {
  console.log('liability result', result);
});
```
