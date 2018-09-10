import abi from 'web3-eth-abi'
import _find from 'lodash/find'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class Event {
  constructor(web3, toContract, contract, nameEvent) {
    this.web3 = web3
    this.toContract = toContract.toLowerCase()
    this.eventAbi = _find(contract.abi, { name: nameEvent, type: 'event' })
    this.address = contract.address.toLowerCase()
    this.topic = abi.encodeEventSignature(this.eventAbi)
    this.id = 'e_' + getRandomInt(0, 10000)
    this.from = 0
    this.to = 0
    this.status = true
    this.queueBlocks = new Queue((num, cb) => {
      this.web3.eth.getBlock(num, true, (e, block) => {
        // console.log(this.id, num);
        if (block !== null) {
          this.parseBlock(block)
        } else {
          // console.log(this.id, 'null', num);
          this.queueBlocks.push(num)
        }
        cb()
      })
    }, { store: new MemoryStore() })
    this.queueTxs = new Queue((hash, cb) => {
      this.web3.eth.getTransactionReceipt(hash, (e, receipt) => {
        if (receipt !== null) {
          // console.log(this.id, hash);
          this.parseTx(receipt)
        } else {
          // console.log(this.id, 'tx null', hash);
          this.queueTxs.push(hash)
        }
        cb()
      })
    }, { store: new MemoryStore() })
    this.cb = () => {}
  }

  watch(cb) {
    if (this.status === false) {
      return
    }
    this.web3.eth.getBlockNumber((e, to) => {
      if (this.from == 0) {
        this.from = to
      }
      if (this.from > to) {
        setTimeout(() => {
          this.watch(cb)
        }, 3000)
        return
      }
      this.to = to
      this.filter(cb)
    })
  }

  filter(cb) {
    this.cb = cb
    for (let i = this.from; i <= this.to; i++) {
      this.queueBlocks.push(i)
    }
    setTimeout(() => {
      this.from = this.to + 1
      this.watch(cb)
    }, 10000)
  }

  stopWatching() {
    this.status = false
  }

  parseBlock(block) {
    if (block.transactions !== null) {
      block.transactions.forEach((tx) => {
        if (tx.to !== null && this.toContract === tx.to.toLowerCase()) {
          this.queueTxs.push(tx.hash)
        }
      })
    }
  }

  parseTx(receipt) {
    receipt.logs.forEach((item) => {
      if (item.address.toLowerCase() === this.address && item.topics[0] === this.topic) {
        item.args = abi.decodeLog(this.eventAbi.inputs, ((item.data === '0x' || item.data === '0X') ? '' : item.data), item.topics.slice(1))
        this.cb(item)
      }
    })
  }
}
