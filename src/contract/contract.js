import Promise from 'bluebird';
import _find from 'lodash/find';
import _isObject from 'lodash/isObject';
import _isFunction from 'lodash/isFunction';
import { utils } from '../web3Utils';
import { watchTx } from './utils/tools';
// import Event from './utils/event';

export default class Contract {
  constructor(web3, abi, address) {
    this.web3 = web3;
    this.address = utils.toChecksumAddress(address);
    this.contract = web3.eth.contract(abi).at(address);
    this.call = new Proxy(this, {
      get: (target, name) => {
        if (
          _find(target.contract.abi, {
            name,
            type: 'function',
            constant: true
          })
        ) {
          return function fn() {
            return target.get(name, [...arguments]);
          };
        }
        return target[name];
      }
    });
    this.send = new Proxy(this, {
      get: (target, name) => {
        if (
          _find(target.contract.abi, {
            name,
            type: 'function',
            constant: false
          })
        ) {
          return function fn() {
            const args = [...arguments];
            let cb = args.pop();
            if (!_isFunction(cb)) {
              args.push(cb);
              cb = null;
            }
            let txArgs = args.pop();
            if (!_isObject(txArgs)) {
              args.push(txArgs);
              txArgs = {};
            }
            let txHash;
            return target
              .method(name, args, txArgs)
              .then(tx => {
                txHash = tx;
                if (cb !== null) {
                  cb(null, tx);
                }
              })
              .catch(e => {
                cb(e);
              })
              .then(() => watchTx(target.web3, txHash));
          };
        }
        return target[name];
      }
    });
    this.event = new Proxy(this, {
      get: (target, name) => {
        if (
          _find(target.contract.abi, {
            name,
            type: 'event'
          })
        ) {
          return function fn(cb, options = {}) {
            return target.subscribe(name, cb, options);
          };
        }
        return target[name];
      }
    });
    this.once = new Proxy(this, {
      get: (target, name) => {
        return (cb, options = {}) => {
          const event = target.event[name]((error, result) => {
            event.stopWatching();
            cb(error, result);
          }, options);
          return event;
        };
      }
    });
  }

  get(func, args = []) {
    return Promise.promisify(this.contract[func])(...args);
  }

  method(func, args = [], txArgs = {}) {
    return Promise.promisify(this.contract[func])(...args, txArgs);
  }

  subscribe(func, cb, options = {}) {
    const event = this.contract[func](options);
    event.watch(cb);
    return event;
  }

  // subscribeF(func, cb, options = {}) {
  //   const event = new Event(this.web3, this.contract, func, options);
  //   event.watch(cb);
  //   return event;
  // }
}
