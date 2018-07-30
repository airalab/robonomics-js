import Promise from 'bluebird'
import { getNonce, recover, hashMsg } from '../utils/recover'

export default class Base {
  constructor() {
    this._props = ['model', 'objective', 'token', 'cost', 'deadline', 'nonce', 'signature']
  }

  initProps(data) {
    this.setProps({
      ...data,
      nonce: data.nonce || getNonce(),
      signature: data.signature || null
    })
  }

  setProps(data) {
    this._props.forEach((name) => {
      this[name] = data[name]
    })
  }

  getProps() {
    const data = {}
    this._props.forEach((name) => {
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
    return Promise.reject('Not signer')
  }

  sign() {
    return this.signer(this.hash())
      .then((result) => {
        this.signature = result
        return true
      })
  }
}
