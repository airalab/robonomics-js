import Promise from 'bluebird'

export default class Contract {
  constructor(web3, abi, address) {
    this.web3 = web3;
    this.address = address;
    this.contract = (this.web3 !== null) ? web3.eth.contract(abi).at(address) : null;
  }

  call(func, args = []) {
    return Promise.promisify(this.contract[func])(...args)
  }
}
