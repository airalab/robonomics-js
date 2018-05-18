import { recover, hashMsg } from '../src/utils/recover'
import web3Beta from '../src/utils/web3Beta'

const signerPrivateKey = (privateKey, hash) => {
  return Promise.resolve(web3Beta.account.sign(hash, privateKey));
}
const privateKey = '0x86d45d144323891b3db834fca9c8f391892f7138220cb5262d583681a065c0e7'

const msg = {
  model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
  objective: 'Qmbdan31EbgETmJU79shwQDHcMgNoRS6RMGDNJZNp8FLCS',
  token: '0x0Ef7fCB816fd725819e071eFB48F7EACb85c1A6A',
  cost: 1,
  count: 1,
  validator: '0x0000000000000000000000000000000000000000',
  validatorFee: 0,
  deadline: 45646546,
  salt: '0xdf530d6252d3bf301411c1e5f27c738b5f64d8336586b2b91855b4d58e2b0b51',
  signature: '0x23b5adfa8d09fed18239b37d380d2167abd0bf069a44b66118abedc86b9586dd1ce8969acd201abb25e95dc599a218481daf52a6c8bc115742a9bd689fe692c71b',
}

describe('recover', () => {
  test('hash msg', () => {
    expect(hashMsg(msg)).toBe('0x1c2bf699c4c10e51f8806d921608afe13f7d7cb716f8c32bea6545ce0ccfd614')
  })
  test('recover acc', () => {
    expect(recover(msg)).toBe('0x3e46243259165152badf2EEB6fE324165cBf81c9')
  })
  test('sign msg', () => {
    expect.assertions(1);
    return expect(signerPrivateKey(privateKey, '0x1c2bf699c4c10e51f8806d921608afe13f7d7cb716f8c32bea6545ce0ccfd614'))
      .resolves.toEqual('0x23b5adfa8d09fed18239b37d380d2167abd0bf069a44b66118abedc86b9586dd1ce8969acd201abb25e95dc599a218481daf52a6c8bc115742a9bd689fe692c71b');
  });
})
