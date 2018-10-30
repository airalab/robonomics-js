import Promise from 'bluebird'
import _has from 'lodash/has'
import { getNonce, recovery, hashMsg } from '../utils/recovery'

export default class Base {
  constructor() {
    this._props = ['model', 'objective', 'token', 'cost', 'validator', 'lighthouse', 'deadline', 'nonce', 'signature']
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
      if (!_has(data, name)) {
        throw new Error("Not found init property " + name)
      }
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

  recovery() {
    return recovery(this)
  }

  signer() {
    return Promise.reject('Not signer')
  }

  sign() {
    return this.signer(this.hash())
      .then((result) => {
        this.signature = result
        return result
      })
  }
}
