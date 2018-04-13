import Base from './base'
import { hashMsg } from '../utils/recover'

export default class Ask extends Base {
  constructor(data) {
    super(data);
    this.objective = data.objective
    this.validator = data.validator
    this.validatorFee = data.validatorFee
  }

  hash() {
    return hashMsg({
      objective: this.objective,
      model: this.model,
      token: this.token,
      validator: this.validator,
      cost: this.cost,
      count: this.count,
      validatorFee: this.validatorFee,
      salt: this.salt,
      deadline: this.deadline
    })
  }
}
