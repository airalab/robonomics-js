import base64 from 'base-64'
import base58 from 'base-58'
import crypto from 'crypto'
import has from 'lodash/has'
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
  if (has(data, 'nonce')) {
    data.nonce = data.nonce.replace('0x', '')
  }
  return Buffer.from(base64.encode(JSON.stringify(data)) + "\r\n")
}

export const decodeMsg = (msg) => {
  const data = JSON.parse(base64.decode(Buffer.from(msg).toString('utf8')))
  data.signature = '0x' + data.signature
  if (has(data, 'nonce')) {
    data.nonce = '0x' + data.nonce
  }
  return data
}

const hashAsk = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.model)) },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.objective)) },
    { type: 'address', value: msg.token },
    { type: 'uint256', value: msg.cost },
    { type: 'address', value: msg.validator },
    { type: 'uint256', value: msg.validatorFee },
    { type: 'uint256', value: msg.deadline },
    { type: 'bytes32', value: msg.nonce }
  )
)
const hashBid = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.model)) },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.objective)) },
    { type: 'address', value: msg.token },
    { type: 'uint256', value: msg.cost },
    { type: 'uint256', value: msg.lighthouseFee },
    { type: 'uint256', value: msg.deadline },
    { type: 'bytes32', value: msg.nonce }
  )
)
const hashRes = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'address', value: msg.liability },
    { type: 'bytes', value: web3Beta.utils.bytesToHex(base58.decode(msg.result)) }
  )
)

export const hashMsgPrefix = (hash) => {
  return web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.stringToHex('\x19Ethereum Signed Message:\n32') },
    { type: 'bytes', value: hash }
  );
}

export const hashMsg = (msg) => {
  let hash
  if (has(msg, 'validator')) {
    hash = hashAsk(msg)
  } else if (has(msg, 'liability')) {
    hash = hashRes(msg)
  } else {
    hash = hashBid(msg)
  }
  return hash
}

export const recover = (msg) => {
  const hash = hashMsgPrefix(hashMsg(msg))
  return web3Beta.account.recover(hash, msg.signature);
}
