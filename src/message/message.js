import has from 'lodash/has'
import Ask from './ask'
import Bid from './bid'
import Result from './result'

export default class Message {
  constructor(signer) {
    this.signer = signer
  }

  create(type, data) {
    let msg;
    if (type === 'ask') {
      msg = new Ask(data)
    } else if (type === 'bid') {
      msg = new Bid(data)
    } else if (type === 'result') {
      msg = new Result(data)
    } else {
      throw new Error('Required type message')
    }
    if (this.signer) {
      msg.signer = this.signer
    }
    return msg
  }
}
