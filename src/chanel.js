import has from 'lodash/has'
import { encodeMsg, decodeMsg } from './utils/recover'
import Message from './message'

export default class Chanel {
  constructor(name, provider) {
    if (provider === null) {
      throw new Error('Message provider required');
    }
    this.provider = provider
    this.market_chan = name + '_market'
    this.result_chan = name + '_result'
    this.message = new Message()
    this.watchers = {
      ask: [],
      bid: [],
      result: []
    }
    this.status = {
      market: false,
      result: false
    }
  }

  push(data) {
    const msg = encodeMsg(data)
    const chan = (!has(data, 'liability')) ? this.market_chan : this.result_chan
    return this.provider.push(chan, msg)
  }

  watch(chan) {
    this.provider.watch(chan, (msg) => {
      const data = this.message.create(decodeMsg(msg))
      if (has(data, 'objective')) {
        this.watchers.ask.forEach((cb) => {
          cb(data)
        })
      } else if (has(data, 'liability')) {
        this.watchers.result.forEach((cb) => {
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
    this.watchers.ask.push(cb)
    if (this.status.market === false) {
      this.watch(this.market_chan)
      this.status.market = true
    }
  }

  bids(cb) {
    this.watchers.bid.push(cb)
    if (this.status.market === false) {
      this.watch(this.market_chan)
      this.status.market = true
    }
  }

  result(cb) {
    this.watchers.result.push(cb)
    if (this.status.result === false) {
      this.watch(this.result_chan)
      this.status.result = true
    }
  }
}
