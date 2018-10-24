class PubSub {
  constructor() {
    this.events = {}
  }
  subscribe(topic, cb) {
    this.events[topic] = this.events[topic] || []
    this.events[topic].push(cb)
  }
  publish(topic, data, fn) {
    if (this.events[topic]) {
      this.events[topic].forEach((cb) => {
        cb({ data })
      })
    }
    fn(null)
  }
}
export default {
  once: (n, cb) => { cb() },
  pubsub: new PubSub()
}
