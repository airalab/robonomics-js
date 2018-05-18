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

  push(channel, msg) {
    return new Promise((resolve, reject) => {
      this.ipfs.pubsub.publish(channel, msg, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  watch(channel, cb) {
    this.ipfs.pubsub.subscribe(channel, (msg) => {
      cb(msg.data)
    })
  }
}
