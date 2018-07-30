import has from 'lodash/has'
import { encodeMsg, decodeMsg } from './utils/recover'
import Message from './message'

export default class Channel {
  constructor(lighthouse, provider) {
    if (provider === null) {
      throw new Error('Message provider required');
    }
    this.provider = provider
    this.lighthouse = lighthouse
    this.message = new Message()
    this.watchers = {
      ask: [],
      bid: [],
      result: []
    }
    this.status = false
  }

  push(data) {
    const props = data.getProps()
    const msg = encodeMsg(props)
    return this.provider.push(this.lighthouse, msg)
  }

  watch() {
    this.provider.watch(this.lighthouse, (msg) => {
      const data = decodeMsg(msg)
      let type = ''
      if (has(data, 'validator')) {
        type = 'ask'
      } else if (has(data, 'liability')) {
        type = 'result'
      } else {
        type = 'bid'
      }
      const message = this.message.create(type, data)
      message.account = message.recover()
      this.watchers[type].forEach((cb) => {
        cb(message)
      })
    })
  }

  asks(cb) {
    this.watchers.ask.push(cb)
    if (this.status === false) {
      this.watch()
      this.status = true
    }
  }

  bids(cb) {
    this.watchers.bid.push(cb)
    if (this.status === false) {
      this.watch()
      this.status = true
    }
  }

  result(cb) {
    this.watchers.result.push(cb)
    if (this.status === false) {
      this.watch()
      this.status = true
    }
  }
}
