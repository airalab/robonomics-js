import { getSalt, recover, hashMsg } from '../utils/recover'

export default class Base {
  constructor() {
    this.props = ['model', 'token', 'cost', 'count', 'deadline', 'salt', 'signature']
  }

  initProps(data) {
    this.setProps({
      ...data,
      salt: data.salt || getSalt(),
      signature: data.signature || null
    })
  }

  setProps(data) {
    this.props.forEach((name) => {
      this[name] = data[name]
    })
  }

  getProps() {
    const data = {}
    this.props.forEach((name) => {
      data[name] = this[name]
    })
    return data
  }

  hash() {
    return hashMsg(this.getProps())
  }

  recover() {
    return recover(this)
  }

  signer() {
    return new Error('Not signer')
  }

  sign(account) {
    return this.signer(account, this.hash())
      .then((result) => {
        this.signature = result
        return true
      })
  }
}
