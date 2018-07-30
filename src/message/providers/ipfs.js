import Promise from 'bluebird'
import Abstract from './abstract'

export default class Ipfs extends Abstract {
  constructor(ipfs) {
    super()
    this.ipfs = ipfs
  }

  ready() {
    return new Promise((resolve) => {
      this.ipfs.once('ready', () => {
        resolve(true)
      })
    })
  }

  push(channel, msg) {
    return new Promise((resolve, reject) => {
      this.ipfs.pubsub.publish(channel, msg, (err) => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }

  watch(channel, cb) {
    this.ipfs.pubsub.subscribe(channel, (msg) => {
      cb(msg.data)
    })
  }
}
