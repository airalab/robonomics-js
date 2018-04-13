import base64 from 'base-64'
import base58 from 'base-58'
import crypto from 'crypto'
import has from 'lodash/has'
import web3Beta from './web3Beta'

export const getSalt = () => {
  return web3Beta.utils.bytesToHex(crypto.randomBytes(32))
}

export const hexToStr = (hex) => {
  const bytes = web3Beta.utils.hexToBytes(hex)
  return base58.encode([18, 32, ...bytes]).toString('utf8')
}

export const encodeMsg = (data) => {
  return Buffer.from(base64.encode(JSON.stringify(data)) + "\r\n")
}

export const decodeMsg = (msg) => {
  const data = JSON.parse(base64.decode(Buffer.from(msg).toString('utf8')))
  data.salt = '0x' + data.salt
  data.signature = '0x' + data.signature
  return data
}

const hashAsk = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes32', value: web3Beta.utils.bytesToHex(base58.decode(msg.model).slice(2)) },
    { type: 'bytes32', value: web3Beta.utils.bytesToHex(base58.decode(msg.objective).slice(2)) },
    { type: 'address', value: msg.token },
    { type: 'address', value: msg.validator },
    { type: 'uint256', value: (msg.cost * msg.count) },
    { type: 'uint256', value: msg.validatorFee },
    { type: 'bytes32', value: msg.salt },
    { type: 'uint256', value: msg.deadline }
  )
)
const hashBid = msg => (
  web3Beta.utils.soliditySha3(
    { type: 'bytes32', value: web3Beta.utils.bytesToHex(base58.decode(msg.model).slice(2)) },
    { type: 'address', value: msg.token },
    { type: 'uint256', value: (msg.cost * msg.count) },
    { type: 'uint256', value: msg.lighthouseFee },
    { type: 'bytes32', value: msg.salt },
    { type: 'uint256', value: msg.deadline }
  )
)

export const hashMsg = (msg) => {
  let hash
  if (has(msg, 'objective')) {
    hash = hashAsk(msg)
  } else {
    hash = hashBid(msg)
  }
  return web3Beta.utils.soliditySha3(
    { type: 'bytes', value: web3Beta.utils.stringToHex('\x19Ethereum Signed Message:\n32') },
    { type: 'bytes', value: hash }
  );
}

export const recover = (msg) => {
  return web3Beta.account.recover(hashMsg(msg), msg.signature);
}
