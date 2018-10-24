import Message, { Demand, Offer, Result } from '../src/message'
import { privateKey } from '../src/message/signer'
import { encodeMsg, decodeMsg } from '../src/utils/recovery'
import * as msgs from './helper/msg'

describe('Messages', () => {
  const accountTest = {
    address: '0x18bddEc5f4710591807F033E30F7400fc936D0ED',
    privateKey: '0xae17d49cf94f4c577c343c8eae102c7f2f29c4a6f571e9ae2b50cd32553b13cb'
  }
  const message = new Message(privateKey(accountTest.privateKey, true))
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
    expect(demand.hash()).toBe('0xa1762c4b18cd5098fe440280c9dd545e5e175a39a5f04030a91824db8f29ab0c')
    expect(offer.hash()).toBe('0xb6d8dfbd0136a759f0402891023f7385c0a7de662c71d3ddeef740bc727f16d3')
    expect(result.hash()).toBe('0x7c9a3ec9351ba568fb65ab03f91b0e81f7c35654a7a54a78f9fb296c01b32393')
  })
  test('recovery acc', () => {
    expect(demand.recovery()).toBe(accountTest.address)
    expect(offer.recovery()).toBe(accountTest.address)
    expect(result.recovery()).toBe(accountTest.address)
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
