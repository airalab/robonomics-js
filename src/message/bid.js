import { getSalt, hashMsg, recover } from '../utils/recover'

export default class Bid {
  constructor({ model, cost, count, fee, salt, signature }) {
    this.model = model
    this.cost = cost
    this.count = count
    this.fee = fee
    this.salt = salt || getSalt()
    this.signature = signature || null
  }

  hash() {
    return hashMsg({
      model: this.model,
      cost: this.cost,
      count: this.count,
      fee: this.fee,
      salt: this.salt
    })
  }

  recover() {
    return recover(this)
  }
}
