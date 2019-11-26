import Abstract from "./abstract";

export default class Ipfs extends Abstract {
  constructor(ipfs) {
    super();
    if (!ipfs.pubsub) {
      throw new Error("This IPFS node does not have pubsub.");
    }
    this._ipfs = ipfs;
  }

  ready() {
    return new Promise(resolve => {
      if (this._ipfs.isOnline()) {
        resolve(true);
      } else {
        this._ipfs.on("ready", function() {
          resolve(true);
        });
      }
    });
  }

  messageDecode(message) {
    return message.data;
  }

  send(topic, message) {
    return new Promise((resolve, reject) => {
      this._ipfs.pubsub.publish(topic, message, function(err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  on(topic, callback) {
    this._ipfs.pubsub.subscribe(topic, callback, { discover: true });
  }

  off(topic, callback) {
    this._ipfs.pubsub.unsubscribe(topic, callback);
  }
}
