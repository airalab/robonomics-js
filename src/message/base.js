import { getSalt, recover } from '../utils/recover'

export default class Base {
  constructor({ model, token, cost, count, deadline, salt, signature }) {
    this.model = model
    this.token = token
    this.cost = cost
    this.count = count
    this.deadline = deadline
    this.salt = salt || getSalt()
    this.signature = signature || null
  }

  recover() {
    return recover(this)
  }
}
