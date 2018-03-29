import Promise from 'bluebird'

export default class Provider {
  constructor(ipfs) {
    this.ipfs = ipfs
  }

  ready() {
    return new Promise((resolve) => {
      this.ipfs.once('ready', () => {
        resolve()
      })
    })
  }

  push(chanel, msg) {
    return new Promise((resolve, reject) => {
      this.ipfs.pubsub.publish(chanel, msg, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  watch(chanel, cb) {
    this.ipfs.pubsub.subscribe(chanel, (msg) => {
      cb(msg.data)
    })
  }
}
