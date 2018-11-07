import base58 from 'base-58'
import crypto from 'crypto'
import _has from 'lodash/has'
import web3Beta from './web3Beta'

export const getNonce = () => {
  return web3Beta.utils.bytesToHex(crypto.randomBytes(32))
}

export const hexToStr = (hex) => {
  const bytes = web3Beta.utils.hexToBytes(hex)
  return base58.encode(bytes).toString('utf8')
}

export const encodeMsg = (data) => {
  data.signature = data.signature.replace('0x', '')
  if (_has(data, 'nonce')) {
    data.nonce = data.nonce.replace('0x', '')
  }
  return Buffer.from(JSON.stringify(data))
}

export const decodeMsg = (msg) => {
  let json = {}
  try {
    json = JSON.parse(Buffer.from(msg).toString('utf8'))
  } catch(e) {
    throw new Error(e)
  }
  const data = { ...json }
  data.signature = '0x' + data.signature
  if (_has(data, 'nonce')) {
    data.nonce = '0x' + data.nonce
  }
  return data
}

const hashDemand = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.model)) },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.objective)) },
    { type: 'address', value: msg.token },
    { type: 'uint256', value: msg.cost },
    { type: 'address', value: msg.lighthouse },
    { type: 'address', value: msg.validator },
    { type: 'uint256', value: msg.validatorFee },
    { type: 'uint256', value: msg.deadline },
    { type: 'bytes32', value: msg.nonce }
  )
)
const hashOffer = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.model)) },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.objective)) },
    { type: 'address', value: msg.token },
    { type: 'uint256', value: msg.cost },
    { type: 'address', value: msg.validator },
    { type: 'address', value: msg.lighthouse },
    { type: 'uint256', value: msg.lighthouseFee },
    { type: 'uint256', value: msg.deadline },
    { type: 'bytes32', value: msg.nonce }
  )
)
const hashRes = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'address', value: msg.liability },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.result)) },
    { type: 'bool', value: msg.success }
  )
)

export const hashMsgPrefix = (hash) => {
  return web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.stringToHex('\x19Ethereum Signed Message:\n32') },
    { type: 'bytes', value: hash }
  )
}

export const hashMsg = (msg) => {
  let hash
  if (_has(msg, 'validatorFee')) {
    hash = hashDemand(msg)
  } else if (_has(msg, 'lighthouseFee')) {
    hash = hashOffer(msg)
  } else if (_has(msg, 'liability')) {
    hash = hashRes(msg)
  }
  return hash
}

export const recovery = (msg) => {
  const hash = hashMsgPrefix(hashMsg(msg))
  return web3Beta.account.recover(hash, msg.signature)
}
