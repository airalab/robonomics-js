import EventEmitter from 'events';

class PubSub extends EventEmitter {
  constructor() {
    super();
    this.emit('ready', true);
  }
  subscribe(topic, cb) {
    this.on(topic, cb);
  }
  publish(topic, data, fn) {
    this.emit(topic, { data });
    fn(null);
  }
  unsubscribe(topic) {
    this.removeAllListeners(topic);
  }
}
export default {
  isOnline: () => {
    return true;
  },
  pubsub: new PubSub()
};
