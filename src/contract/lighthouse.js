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
}
