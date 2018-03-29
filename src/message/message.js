import has from 'lodash/has'
import Bid from './bid'
import Ask from './ask'

export default class Message {
  constructor(signer = null) {
    this.signer = signer
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
