import Base from './base'
import { hashMsg } from '../utils/recover'

export default class Bid extends Base {
  constructor(data) {
    super(data);
    this.lighthouseFee = data.lighthouseFee
  }

  hash() {
    return hashMsg({
      model: this.model,
      token: this.token,
      cost: this.cost,
      count: this.count,
      lighthouseFee: this.lighthouseFee,
      salt: this.salt,
      deadline: this.deadline
    })
  }
}
