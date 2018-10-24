import Channel from '../src/channel'
import ProviderIpfs from '../src/message/providers/ipfs'
import Message, { Demand, Offer, Result } from '../src/message'
import ipfs from './helper/ipfs'
import * as msgs from './helper/msg'

describe('Channel', () => {
  const message = new Message()
  const demand = message.create('demand', msgs.demands.valid)
  const offer = message.create('offer', msgs.offers.valid)
  const result = message.create('result', msgs.results.valid)
  const provider = new ProviderIpfs(ipfs)
  const channel = new Channel('airalab.lighthouse.0.robonomics.eth', provider)
  test('demand', (done) => {
    channel.demands((msg) => {
      expect(demand.getProps()).toEqual(msg.getProps())
      expect(msg).toBeInstanceOf(Demand)
      done()
    })
    channel.push(demand)
  })
  test('offer', (done) => {
    channel.offers((msg) => {
      expect(offer.getProps()).toEqual(msg.getProps())
      expect(msg).toBeInstanceOf(Offer)
      done()
    })
    channel.push(offer)
  })
  test('result', (done) => {
    channel.result((msg) => {
      expect(result.getProps()).toEqual(msg.getProps())
      expect(msg).toBeInstanceOf(Result)
      done()
    })
    channel.push(result)
  })
})
