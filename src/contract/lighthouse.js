import Contract from './contract'
import ABI from '../abi/Lighthouse.json'

export default class Lighthouse extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  getMembers() {
    const members = [];
    const getMembers = (i, cb) => {
      this.contract.members(i, (e, r) => {
        if (r !== '0x') {
          members.push(this.web3.toChecksumAddress(r));
          getMembers(i + 1, cb);
        } else {
          cb();
        }
      });
    };
    return new Promise((resolve) => {
      getMembers(0, () => {
        resolve(members)
      });
    })
  }

  getInfo() {
    return Promise.join(
      this.call('minimalFreeze'),
      this.call('timeoutBlocks'),
      this.call('keepaliveBlock'),
      this.call('marker'),
      this.call('quota'),
      (...info) => (
        {
          minimalFreeze: Number(info[0]),
          timeoutBlocks: Number(info[1]),
          keepaliveBlock: Number(info[2]),
          marker: Number(info[3]),
          quota: Number(info[4]),
        }
      )
    )
  }
}
