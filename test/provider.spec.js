import '@babel/polyfill';
import MessageProvider from '../src/messenger/provider/ipfs';
import ipfs from './helper/ipfs';

const provider = new MessageProvider(ipfs);
const channel1 = provider.createChannel('topic1');
const channel2 = provider.createChannel('topic2');

describe('Provider', () => {
  afterEach(() => {
    channel1.stop();
    channel2.stop();
  });
  test('one channel', done => {
    expect.assertions(2);
    channel1.on(msg => {
      expect('test').toEqual(msg);
      done();
    });
    channel1.send('test');
    channel1.send('test');
  });
  test('multy channels', () => {
    expect.assertions(3);
    channel1.on(msg => {
      expect('test1').toEqual(msg);
    });
    channel2.on(msg => {
      expect('test2').toEqual(msg);
    });
    channel1.send('test1');
    channel2.send('test2');
    channel1.send('test1');
  });
  test('once event', () => {
    expect.assertions(1);
    channel1.once(msg => {
      expect('test').toEqual(msg);
    });
    channel1.send('test');
    channel1.send('test');
  });
  test('stop channel', () => {
    expect.assertions(6);
    channel1.on(msg => {
      expect('test1').toEqual(msg);
    });
    channel1.on(msg => {
      expect('test1').toEqual(msg);
    });
    channel2.on(msg => {
      expect('test2').toEqual(msg);
    });
    channel1.send('test1');
    channel1.send('test1');
    channel2.send('test2');
    channel1.stop();
    channel1.send('test1');
    channel2.send('test2');
  });
});
