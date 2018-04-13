import has from 'lodash/has'
import { encodeMsg, decodeMsg } from './utils/recover'
import Message from './message'

export default class Chanel {
  constructor(name, provider) {
    if (provider === null) {
      throw new Error('Message provider required');
    }
    this.provider = provider
    this.name = name
    this.message = new Message()
    this.watchers = {
      ask: [],
      bid: []
    }
    this.watch()
  }

  push(data) {
    data.signature = data.signature.replace('0x', '')
    data.salt = data.salt.replace('0x', '')
    const msg = encodeMsg(data)
    return this.provider.push(this.name, msg)
  }

  watch() {
    this.provider.watch(this.name, (msg) => {
      const data = this.message.create(decodeMsg(msg))
      if (has(data, 'objective')) {
        this.watchers.ask.forEach((cb) => {
          cb(data)
        })
      } else {
        this.watchers.bid.forEach((cb) => {
          cb(data)
        })
      }
    })
  }

  asks(cb) {
    this.watchers.ask.push(cb);
  }

  bids(cb) {
    this.watchers.bid.push(cb);
  }
}
