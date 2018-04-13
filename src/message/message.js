import has from 'lodash/has'
import Promise from 'bluebird'
import Bid from './bid'
import Ask from './ask'
import web3Beta from '../utils/web3Beta'

const signerPrivateKey = (privateKey, hash) => {
  return Promise.resolve(web3Beta.account.sign(hash, privateKey));
}

export default class Message {
  constructor(signer) {
    this.signer = signer || signerPrivateKey
  }

  create(data) {
    if (has(data, 'objective')) {
      return new Ask(data)
    }
    return new Bid(data)
  }

  sign(account, msg) {
    return (this.signer === null) ? new Error('Not signer') :
      this.signer(account, msg.hash())
        .then((result) => {
          msg.signature = result
          return msg
        })
  }
}
