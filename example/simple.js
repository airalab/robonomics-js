import Robonomics, { MessageProviderIpfsApi } from 'robonomics-js';

const robonomics = new Robonomics({
  messageProvider: new MessageProviderIpfsApi(
    new IPFS('http://localhost:5001')
  ),
  lighthouse: 'airalab'
});

robonomics.ready().then(() => {
  console.log('xrt', robonomics.xrt.address);
  console.log('factory', robonomics.factory.address);
  console.log('lighthouse', robonomics.lighthouse.address);

  const model = 'QmWXk8D1Fh5XFJvBodcWbwgyw9htjc6FJg8qi1YYEoPnrg';

  robonomics.onDemand(model, msg => {
    console.log('demand', msg);
  });

  robonomics.onOffer(model, msg => {
    console.log('offer', msg);
  });

  robonomics.onResult(msg => {
    console.log('result', msg);
  });

  const demand = {
    model: model,
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    lighthouse: robonomics.lighthouse.address,
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999
  };
  robonomics.sendDemand(demand).then(liability => {
    console.log('liability', liability.address);
  });

  const offer = {
    model: model,
    objective: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M',
    token: robonomics.xrt.address,
    cost: 1,
    lighthouse: robonomics.lighthouse.address,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouseFee: 0,
    deadline: 9999999
  };
  robonomics.sendOffer(offer).then(liability => {
    console.log('liability', liability.address);
  });

  robonomics.onLiability(liability => {
    console.log('liability', liability.address);
  });

  robonomics.sendResult({
    liability: liability.address,
    success: true,
    result: 'QmSt69qQqGka1qwRRHbdmAWk4nCbsV1mqJwd8cWbEyhf1M'
  });

  robonomics.ens.addr('airalab.lighthouse.0.robonomics.eth').then(address => {
    console.log('address', address);
  });

  robonomics.xrt.call.balanceOf('0x123..........').then(balance => {
    console.log('balance', balance);
  });

  robonomics.xrt.send
    .approve(robonomics.factory.address, 100000, {
      from: robonomics.account
    })
    .then(receipt => {
      console.log('tx', receipt);
    });

  robonomics.xrt.send
    .approve(robonomics.factory.address, 100000, {
      from: robonomics.account
    })
    .then(receipt => {
      console.log('tx', receipt);
    });
});
