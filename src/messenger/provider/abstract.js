import Channel from '../channel';

export default class Abstract {
  constructor() {
    if (this.constructor === Abstract) {
      throw new TypeError('Can not construct abstract class.');
    }
    this.channels = {};
  }

  createChannel(topic) {
    const channel = new Channel(topic, this);
    this.channels[topic] = channel;
    return channel;
  }

  ready() {
    throw new TypeError('Do not call abstract method foo from child.');
  }

  messageDecode(message) {
    return message;
  }

  send() {
    throw new TypeError('Do not call abstract method foo from child.');
  }

  on() {
    throw new TypeError('Do not call abstract method foo from child.');
  }

  off() {
    throw new TypeError('Do not call abstract method foo from child.');
  }
}
