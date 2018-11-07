import Promise from 'bluebird'
import web3Beta from '../utils/web3Beta'
import { hashMsgPrefix } from '../utils/recovery'

export const privateKey = (privateKey, prefix = true) => {
  let setPrefix = hash => hash
  if (prefix) {
    setPrefix = hashMsgPrefix
  }
  return (hash) => Promise.resolve(web3Beta.account.sign(setPrefix(hash), privateKey))
}

export const getAddressPrivateKey = (privateKey) => {
  const account = web3Beta.account.fromPrivate(privateKey)
  return account.address
}

export const account = (web3, account, prefix = true) => {
  let setPrefix = hash => hash
  if (prefix) {
    setPrefix = hashMsgPrefix
  }
  return (hash) => Promise.promisify(web3.eth.sign)(account, setPrefix(hash))
}
