export default class Abstract {
  constructor() {
    if (this.constructor === Abstract) {
      throw new TypeError("Can not construct abstract class.")
    }
  }

  ready() {
    throw new TypeError("Do not call abstract method foo from child.")
  }

  push() {
    throw new TypeError("Do not call abstract method foo from child.")
  }

  watch() {
    throw new TypeError("Do not call abstract method foo from child.")
  }
}
