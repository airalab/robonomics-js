import has from 'lodash/has'
import { encodeMsg, decodeMsg } from './utils/recover'
import Message from './message'

export default class Chanel {
  constructor(name, provider) {
    this.provider = provider
    this.name = name
    this.message = new Message()
  }

  push(data) {
    data.signature = data.signature.replace('0x', '')
    data.salt = data.salt.replace('0x', '')
    const msg = encodeMsg(data)
    return this.provider.push(this.name, msg)
  }

  watch(cb) {
    this.provider.watch(this.name, (msg) => {
      cb(this.message.create(decodeMsg(msg)))
    })
  }

  asks(cb) {
    this.watch((msg) => {
      if (has(msg, 'objective')) {
        cb(msg);
      }
    })
  }

  bids(cb) {
    this.watch((msg) => {
      if (!has(msg, 'objective')) {
        cb(msg);
      }
    })
  }
}
