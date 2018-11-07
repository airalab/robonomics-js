import _has from 'lodash/has'
import { encodeMsg, decodeMsg } from './utils/recovery'
import Message from './message'

export default class Channel {
  constructor(lighthouse, provider) {
    if (provider === null) {
      throw new Error('Message provider required')
    }
    this.provider = provider
    this.lighthouse = lighthouse
    this.message = new Message()
    this.watchers = {
      demand: [],
      offer: [],
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
      if (_has(data, 'validatorFee')) {
        type = 'demand'
      } else if (_has(data, 'lighthouseFee')) {
        type = 'offer'
      } else if (_has(data, 'liability')) {
        type = 'result'
      }
      const message = this.message.create(type, data)
      message.account = message.recovery()
      this.watchers[type].forEach((cb) => {
        cb(message)
      })
    })
  }

  demands(cb) {
    this.watchers.demand.push(cb)
    if (this.status === false) {
      this.watch()
      this.status = true
    }
  }

  offers(cb) {
    this.watchers.offer.push(cb)
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
