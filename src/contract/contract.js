import Promise from 'bluebird'

export default class Contract {
  constructor(web3, abi, address) {
    if (web3 === null) {
      throw new Error('To use contrasts required web3')
    }
    this.web3 = web3
    this.address = web3.toChecksumAddress(address)
    this.contract = web3.eth.contract(abi).at(address)
  }

  call(func, args = []) {
    return Promise.promisify(this.contract[func])(...args)
  }

  send(func, args = [], txArgs = {}) {
    return Promise.promisify(this.contract[func])(...args, txArgs)
  }
}
