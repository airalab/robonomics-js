import utils from "web3-utils";
import Contract from "./contract";
import ABI from "./abi/Lighthouse.json";

export default class Lighthouse extends Contract {
  constructor(web3, address, name = "") {
    super(web3, ABI, address);
    this.name = name;
  }

  async getProviders() {
    const providers = [];
    const count = await this.methods.providersLength().call();
    for (let i = 0; i < count; i++) {
      const provider = await this.methods.providers(i).call();
      providers.push(utils.toChecksumAddress(provider));
    }
    return providers;
  }

  getInfo() {
    return Promise.all([
      this.methods.minimalStake().call(),
      this.methods.timeoutInBlocks().call(),
      this.methods.keepAliveBlock().call(),
      this.methods.marker().call(),
      this.methods.quota().call()
    ]).then(info => {
      return {
        minimalStake: Number(info[0]),
        timeoutInBlocks: Number(info[1]),
        keepAliveBlock: Number(info[2]),
        marker: Number(info[3]),
        quota: Number(info[4])
      };
    });
  }
}
