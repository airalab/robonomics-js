import EventEmitter from 'events';
import Queue from 'better-queue';
import MemoryStore from 'better-queue-memory';
import _has from 'lodash/has';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';

let inst = null;
export default web3 => {
  if (inst === null) {
    inst = new Scanner(web3);
  }
  return inst;
};
class Scanner extends EventEmitter {
  constructor(web3) {
    super();
    this.web3 = web3;
    this.from = 0;
    this.to = 0;
    this.contracts = {};
    this.isWork = false;
    this.queueBlocks = new Queue(
      (num, cb) => {
        this.web3.eth.getBlock(num, true, (e, block) => {
          if (block !== null) {
            this._parseBlock(block);
          } else {
            this.queueBlocks.push(num);
          }
          cb();
        });
      },
      { store: new MemoryStore() }
    );
    this.queueTxs = new Queue(
      (hash, cb) => {
        this.web3.eth.getTransactionReceipt(hash, (e, receipt) => {
          if (receipt !== null) {
            receipt.logs.forEach(item => {
              this.emit(item.address.toLowerCase(), item);
            });
            // this.emit(receipt.to.toLowerCase(), receipt);
          } else {
            this.queueTxs.push(hash);
          }
          cb();
        });
      },
      { store: new MemoryStore() }
    );
  }

  on(address, cb) {
    const a = address.toLowerCase();
    super.on(a, cb);
    if (_has(this.contracts, a)) {
      this.contracts[a] += 1;
    } else {
      this.contracts[a] = 1;
    }
    if (this.isWork === false) {
      this.isWork = true;
      this._scan();
    }
  }

  off(address, cb) {
    const a = address.toLowerCase();
    super.off(a, cb);
    this.contracts[a] -= 1;
    if (this.contracts[a] === 0) {
      this.contracts = _omit(this.contracts, a);
    }
    if (_isEmpty(this.contracts)) {
      this.isWork = false;
    }
  }

  stop() {
    this.contracts = {};
    this.isWork = false;
    this.removeAllListeners();
  }

  _scan() {
    if (this.isWork === false) {
      return;
    }
    this.web3.eth.getBlockNumber((e, to) => {
      if (this.from === 0) {
        this.from = to;
      }
      if (this.from > to) {
        setTimeout(() => {
          this._scan();
        }, 3000);
        return;
      }
      this.to = to;
      this._filter();
    });
  }

  _filter() {
    for (let i = this.from; i <= this.to; i++) {
      this.queueBlocks.push(i);
    }
    setTimeout(() => {
      this.from = this.to + 1;
      this._scan();
    }, 1000);
  }

  _parseBlock(block) {
    if (block.transactions !== null) {
      block.transactions.forEach(tx => {
        if (tx.to !== null /* && _has(this.contracts, tx.to.toLowerCase())*/) {
          this.queueTxs.push(tx.hash);
        }
      });
    }
  }
}
