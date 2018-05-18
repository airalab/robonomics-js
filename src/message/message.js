import has from 'lodash/has'
import Promise from 'bluebird'
import Ask from './ask'
import Bid from './bid'
import Result from './result'
import web3Beta from '../utils/web3Beta'

const signerPrivateKey = (privateKey, hash) => {
  return Promise.resolve(web3Beta.account.sign(hash, privateKey));
}

export default class Message {
  constructor(signer) {
    this.signer = signer || signerPrivateKey
  }

  create(data) {
    let msg;
    if (has(data, 'objective')) {
      msg = new Ask(data)
    } else if (has(data, 'liability')) {
      msg = new Result(data)
    } else {
      msg = new Bid(data)
    }
    msg.signer = this.signer
    return msg
  }
}
