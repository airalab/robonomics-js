import EventEmitter from 'events';

export default class Channel {
  constructor(topic, provider) {
    this.topic = topic;
    this.provider = provider;
    this.isListening = false;
    this.eventEmitter = new EventEmitter();
  }

  run() {
    if (this.isListening === false) {
      this.provider.on(this.topic, this.bridge.bind(this));
      this.isListening = true;
    }
  }

  on(callback) {
    this.run();
    this.eventEmitter.on('message', callback);
  }

  once(callback) {
    this.run();
    this.eventEmitter.once('message', callback);
  }

  send(message) {
    return this.provider.send(this.topic, message);
  }

  /**
   * При получении сообщения от провайдера, создает событие для мессенджер
   *
   * @method bridge
   *
   * @param {String} message
   */
  bridge(message) {
    this.eventEmitter.emit('message', this.provider.messageDecode(message));
  }

  off(callback) {
    this.eventEmitter.removeListener('message', callback);
  }

  stop() {
    this.eventEmitter.removeAllListeners();
    this.provider.off(this.topic, this.bridge.bind(this));
    this.isListening = false;
  }
}
