import '@babel/polyfill';
import Account from '../src/account';
import config from './config.json';

const account = new Account(null, config.accounts.demand.privateKey, false);

describe('Account', () => {
  test('address by privateKey', () => {
    expect(config.accounts.demand.address).toEqual(account.address);
  });
  test('sign', done => {
    expect.assertions(1);
    account.sign('hello').then(r => {
      expect(
        '0x20e433ccdddab9b540c82b3a5a371c06a989976bbc1d8d7086d540652d1537bf3dcd95f3f71a032ef246d1b1703ecfa9495259db70f08016b79c43db268712561c'
      ).toEqual(r);
      done();
    });
  });
});
