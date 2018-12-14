import Message, { Demand, Offer, Result } from '../src/message'
import { privateKey } from '../src/message/signer'
import { encodeMsg, decodeMsg } from '../src/utils/recovery'
import * as msgs from './helper/msg'
import config from './config.json'

describe('Messages', () => {
  const message = new Message(privateKey(config.account.privateKey, true))
  const demand = message.create('demand', msgs.demands.valid)
  const offer = message.create('offer', msgs.offers.valid)
  const result = message.create('result', msgs.results.valid)

  test('init valid msg', () => {
    expect(demand).toBeInstanceOf(Demand)
    expect(offer).toBeInstanceOf(Offer)
    expect(result).toBeInstanceOf(Result)
  })
  test('init bad msg', () => {
    expect(() => message.create('demand', msgs.demands.bad)).toThrow()
    expect(() => message.create('offer', msgs.offers.bad)).toThrow()
    expect(() => message.create('test', msgs.demands.valid)).toThrow()
  })
  test('hash msg', () => {
    expect(demand.hash()).toBe('0x370adaaa832a5c394a7836c8f489f725059a82ff1606ef84d94e23b69c271ecd')
    expect(offer.hash()).toBe('0xb135cc6936de8370ad7577201d9e8dea4f1d1227afbf6ce87b90318775742ce9')
    expect(result.hash()).toBe('0x7c9a3ec9351ba568fb65ab03f91b0e81f7c35654a7a54a78f9fb296c01b32393')
  })
  test('recovery acc', () => {
    // console.log(demand.recovery())
    // console.log(config.account, config.account.address)
    expect(demand.recovery()).toBe(config.account.address)
    expect(offer.recovery()).toBe(config.account.address)
    expect(result.recovery()).toBe(config.account.address)
  })
  test('sign', async () => {
    expect.assertions(3)
    await demand.sign()
    await offer.sign()
    await result.sign()
    expect(demand.signature).toEqual(msgs.demands.valid.signature)
    expect(offer.signature).toEqual(msgs.offers.valid.signature)
    expect(result.signature).toEqual(msgs.results.valid.signature)
  })
  test('encode decode', () => {
    const encodeDemand = encodeMsg(demand.getProps())
    const decodeDemand = decodeMsg(encodeDemand)
    const newDemand = message.create('demand', decodeDemand)
    expect(newDemand).toEqual(demand)
  })
})
