import Bid from './bid'
import { hashMsg } from '../utils/recover'

export default class Ask extends Bid {
  constructor(data) {
    super(data);
    this.objective = data.objective
  }

  hash() {
    return hashMsg({
      objective: this.objective,
      model: this.model,
      cost: this.cost,
      count: this.count,
      fee: this.fee,
      salt: this.salt
    })
  }
}
