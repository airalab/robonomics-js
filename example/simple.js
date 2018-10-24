import Robonomics, { MessageProviderIpfsApi } from 'robonomics-js'

const robonomics = new Robonomics({
  provider: new MessageProviderIpfsApi(new IPFS('http://localhost:5001'))
})

robonomics.ready().then(() => {
  console.log('xrt', robonomics.xrt.address)
  console.log('factory', robonomics.factory.address)
  console.log('lighthouse', robonomics.lighthouse.address)

  const market = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg'

  robonomics.getDemand(market, (msg) => {
    console.log('demand', msg)
  })

  robonomics.getOffer(market, (msg) => {
    console.log('offer', msg)
  })

  robonomics.getResult((msg) => {
    console.log('result', msg)
  })

  const demand = {
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999
  }
  robonomics.postDemand(market, demand)
    .then((liability) => {
      console.log('liability', liability.address)
    })

  const offer = {
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouseFee: 0,
    deadline: 9999999
  }
  robonomics.postOffer(market, offer)
    .then((liability) => {
      console.log('liability', liability.address)
    })

  robonomics.watchLiability(market, (liability) => {
    console.log('liability', liability.address)
  })

  robonomics.postResult({ liability: liability.address, success: true, result: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M' })

  robonomics.ens.addr('airalab.lighthouse.0.robonomics.eth')
    .then((address) => {
      console.log('address', address)
    })

  robonomics.xrt.call('balanceOf', ['0x123..........'])
    .then((balance) => {
      console.log('balance', balance)
    })

  robonomics.xrt.send('approve', [robonomics.factory.address, 100000], { from: robonomics.account })
    .then((tx) => {
      console.log('tx', tx)
    })

  robonomics.xrt.send('approve', [robonomics.factory.address, 100000], { from: robonomics.account })
    .then((tx) => {
      console.log('tx', tx)
    })
})
