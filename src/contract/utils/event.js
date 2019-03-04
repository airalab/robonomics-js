import EventEmitter from 'events';
import _find from 'lodash/find';
import _isObject from 'lodash/isObject';
import * as web3Utils from '../../web3Utils';
import Scanner from './scanner';

function encodeEventSignature(functionName) {
  if (_isObject(functionName)) {
    functionName = web3Utils.utils.jsonInterfaceMethodToString(functionName);
  }
  return web3Utils.utils.sha3(functionName);
}

function _getAbiEvent(abi, name) {
  return _find(abi, { name: name, type: 'event' });
}

function _getTopicHex(abi, name) {
  return encodeEventSignature(_getAbiEvent(abi, name));
}

function parseLog(address, topic, abiInputs, data) {
  if (
    data.address.toLowerCase() === address.toLowerCase() &&
    topic === data.topics[0]
  ) {
    data.args = web3Utils.abi.decodeLog(
      abiInputs,
      data.data === '0x' || data.data === '0X' ? '' : data.data,
      data.topics.slice(1)
    );
    return data;
  }
  return false;
}

export default class Event extends EventEmitter {
  constructor(web3, contract, name) {
    super();
    this.web3 = web3;
    this.contract = contract;
    this.name = name;
    this.topic = _getTopicHex(this.contract.abi, this.name);
    this.scanner = Scanner(this.web3);
  }

  watch(cb) {
    this.on(this.topic, cb);
    this.scanner.on(this.contract.address, this._parseTx.bind(this));
  }

  stopWatching() {
    this.removeAllListeners(this.topic);
    this.scanner.off(this.contract.address, this._parseTx.bind(this));
  }

  _parseTx(item) {
    const data = parseLog(
      this.contract.address,
      this.topic,
      _getAbiEvent(this.contract.abi, this.name).inputs,
      item
    );
    if (data) {
      this.emit(this.topic, null, data);
    }
  }
}
