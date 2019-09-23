import _has from 'lodash/has';
import Demand from './message/demand';
import Offer from './message/offer';
import Result from './message/result';

const decodeMsg = msg => {
  let json = {};
  try {
    json = JSON.parse(Buffer.from(msg).toString('utf8'));
  } catch (e) {
    throw new Error(e);
  }
  const data = { ...json };
  data.signature = '0x' + data.signature;
  return data;
};

export default class Messenger {
  static get TYPE_DEMAND() {
    return 'demand';
  }
  static get TYPE_OFFER() {
    return 'offer';
  }
  static get TYPE_RESULT() {
    return 'result';
  }

  constructor(channel, account) {
    this.channel = channel;
    this.account = account;
  }

  static create(type, data) {
    if (type === this.TYPE_DEMAND) {
      return new Demand(data);
    } else if (type === this.TYPE_OFFER) {
      return new Offer(data);
    } else if (type === this.TYPE_RESULT) {
      return new Result(data);
    }
    throw new Error('Required type message');
  }

  async send(message) {
    if (
      !(message instanceof Demand) &&
      !(message instanceof Offer) &&
      !(message instanceof Result)
    ) {
      throw new Error('Bad type message');
    }
    // eslint-disable-next-line require-atomic-updates
    message.signature = await this.account.signMessage(message);
    this.channel.send(message.encode());
    return message;
  }

  on(callback) {
    const listener = msg => {
      const data = decodeMsg(msg);
      let type;
      if (_has(data, 'validatorFee')) {
        type = Messenger.TYPE_DEMAND;
      } else if (_has(data, 'lighthouseFee')) {
        type = Messenger.TYPE_OFFER;
      } else if (_has(data, 'liability')) {
        type = Messenger.TYPE_RESULT;
      } else {
        callback(new Error('Type not allocated'), null);
      }
      const message = Messenger.create(type, data);
      callback(null, message);
    };
    this.channel.on(listener);
    return listener;
  }

  onDemand(callback) {
    return this.on((error, message) => {
      if (!(message instanceof Demand)) {
        return;
      }
      callback(error, message);
    });
  }

  onOffer(callback) {
    return this.on((error, message) => {
      if (!(message instanceof Offer)) {
        return;
      }
      callback(error, message);
    });
  }

  onResult(callback) {
    return this.on((error, message) => {
      if (!(message instanceof Result)) {
        return;
      }
      callback(error, message);
    });
  }

  off(listener) {
    this.channel.off(listener);
  }

  stop() {
    this.channel.stop();
  }
}
