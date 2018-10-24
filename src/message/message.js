import Demand from './demand'
import Offer from './offer'
import Result from './result'

export default class Message {
  constructor(signer) {
    this.signer = signer
  }

  create(type, data) {
    let msg;
    if (type === 'demand') {
      msg = new Demand(data)
    } else if (type === 'offer') {
      msg = new Offer(data)
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
