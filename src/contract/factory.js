import Contract from './contract'
import Liability from './liability'
import Lighthouse from './lighthouse'
import Event from './event'
import ABI from '../abi/Factory.json'
import { getInstance } from '../robonomics'

export default class Factory extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address)
  }

  watchLiability(cb) {
    const robonomics = getInstance()
    const event = new Event(this.web3, robonomics.lighthouse.address, this.contract, 'NewLiability')
    event.watch((result) => {
      this.web3.eth.getTransaction(result.transactionHash, (e, r) => {
        const liability = new Liability(this.web3, result.args.liability, r.from)
        cb(liability)
      })
    })
    return event
  }

  watchLighthouse(cb) {
    const event = new Event(this.web3, this.contract.address, this.contract, 'NewLighthouse')
    event.watch((result) => {
      const lighthouse = new Lighthouse(this.web3, result.args.lighthouse, result.args.name)
      cb(lighthouse, result)
    })
    return event
  }

  stop(event) {
    return event.stopWatching()
  }
}
