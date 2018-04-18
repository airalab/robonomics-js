import { hashMsg } from '../utils/recover'

export default class Result {
  constructor({ liability, result, signature }) {
    this.liability = liability
    this.result = result
    this.signature = signature || null
  }

  hash() {
    return hashMsg({
      liability: this.liability,
      result: this.result
    })
  }
}
