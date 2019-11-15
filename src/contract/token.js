import Contract from "./contract";
import ABI from "./abi/TokenEmission.json";

export default class Token extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  getInfo() {
    return Promise.all([
      this.methods.name().call(),
      this.methods.totalSupply().call(),
      this.methods.decimals().call(),
      this.methods.symbol().call()
    ]).then(info => {
      return {
        name: info[0],
        totalSupply: Number(info[1]),
        decimals: Number(info[2]),
        symbol: info[3]
      };
    });
  }
}
