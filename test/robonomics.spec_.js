import '@babel/polyfill';
import Web3 from 'web3';
import Robonomics, { MessageProviderIpfs } from '../src/index';
import Demand from '../src/messenger/message/demand';
import Offer from '../src/messenger/message/offer';
import Result from '../src/messenger/message/result';
import ipfs from './helper/ipfs';
import * as msgs from './helper/msg';
import config from './config.json';
import provider from './helper/provider';

jest.setTimeout(20000);

const robonomicsProvider = new Robonomics({
  // web3: {
  //   provider: config.robonomics.web3,
  //   options: {
  //     transactionConfirmationBlocks: 2
  //   }
  // },
  web3: new Web3(new Web3.providers.HttpProvider(config.robonomics.web3)),
  account: {
    privateKey: config.accounts.provider.privateKey,
    isSignPrefix: false
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab265'
});
const robonomicsOffer = new Robonomics({
  web3: new Web3(new Web3.providers.HttpProvider(config.robonomics.web3)),
  account: {
    privateKey: config.accounts.offer.privateKey,
    isSignPrefix: false
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab265'
});
const robonomicsDemand = new Robonomics({
  web3: new Web3(new Web3.providers.HttpProvider(config.robonomics.web3)),
  account: {
    privateKey: config.accounts.demand.privateKey,
    isSignPrefix: false
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab265'
});

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

const name = 'airalab' + randomInteger(1, 1000);
const stake = 1000;

beforeAll(() => {
  return Promise.all([
    robonomicsDemand.ready(),
    robonomicsOffer.ready(),
    robonomicsProvider.ready()
  ]).then(() => {
    return Promise.all([
      robonomicsDemand.xrt.send.transfer(
        robonomicsOffer.account.address,
        1000,
        {
          from: robonomicsDemand.account.address,
          gas: 3000000
        }
      ),
      robonomicsDemand.xrt.send.transfer(
        robonomicsProvider.account.address,
        1000,
        {
          from: robonomicsDemand.account.address,
          gas: 3000000
        }
      )
    ]);
  });
});

afterAll(() => {
  for (let i = 0; i < 10; i++) {
    clearTimeout(i);
  }
  // console.log(process._getActiveHandles());
});

describe('Balances', () => {
  test('check', async () => {
    expect.assertions(3);
    const balanceDemand = await robonomicsDemand.xrt.call.balanceOf(
      robonomicsDemand.account.address
    );
    expect(Number(balanceDemand)).toBeGreaterThanOrEqual(1000);

    const balanceOffer = await robonomicsOffer.xrt.call.balanceOf(
      robonomicsOffer.account.address
    );
    expect(Number(balanceOffer)).toBeGreaterThanOrEqual(1000);

    const balanceProvider = await robonomicsProvider.xrt.call.balanceOf(
      robonomicsProvider.account.address
    );
    expect(Number(balanceProvider)).toBeGreaterThanOrEqual(1000);
  });
});

describe('Robonomics', () => {
  test('create lighthouse', done => {
    expect.assertions(1);
    const watcher = robonomicsProvider.factory.onLighthouse(
      (error, lighthouse) => {
        watcher.stopWatching();
        // console.log(name);
        // console.log(lighthouse.address);
        robonomicsProvider.setLighthouse(lighthouse);
        robonomicsDemand.setLighthouse(lighthouse);
        robonomicsOffer.setLighthouse(lighthouse);
        expect(name).toEqual(name);
        done();
      }
    );
    robonomicsProvider.factory.send.createLighthouse(stake, 10, name, {
      from: robonomicsProvider.account.address,
      gas: 3000000
    });
  });
  test('refill', done => {
    expect.assertions(2);
    robonomicsProvider.xrt.send
      .approve(robonomicsProvider.lighthouse.address, stake, {
        from: robonomicsProvider.account.address,
        gas: 3000000
      })
      .then(() =>
        robonomicsProvider.xrt.call.allowance(
          robonomicsProvider.account.address,
          robonomicsProvider.lighthouse.address
        )
      )
      .then(r => {
        expect(stake).toEqual(Number(r));
        return robonomicsProvider.lighthouse.send.refill(stake, {
          from: robonomicsProvider.account.address,
          gas: 3000000
        });
      })
      .then(() =>
        robonomicsProvider.lighthouse.call.stakes(
          robonomicsProvider.account.address
        )
      )
      .then(r => {
        expect(stake).toEqual(Number(r));
        done();
      });
  });
});

describe('Messages', () => {
  test('demand', done => {
    expect.assertions(2);
    const demand = msgs.demands.blank;
    demand.token = robonomicsDemand.xrt.address;
    demand.lighthouse = robonomicsDemand.lighthouse.address;
    const listener = robonomicsDemand.onDemand(demand.model, msg => {
      expect(msg.account).toEqual(robonomicsDemand.account.address);
      expect(msg).toBeInstanceOf(Demand);
      robonomicsDemand.messenger.off(listener);
      done();
    });
    robonomicsDemand.sendDemand(demand, false);
  });
  test('offer', done => {
    expect.assertions(2);
    const offer = msgs.offers.blank;
    offer.token = robonomicsOffer.xrt.address;
    offer.lighthouse = robonomicsOffer.lighthouse.address;
    const listener = robonomicsOffer.onOffer(offer.model, msg => {
      expect(msg.account).toEqual(robonomicsOffer.account.address);
      expect(msg).toBeInstanceOf(Offer);
      robonomicsOffer.messenger.off(listener);
      done();
    });
    robonomicsOffer.sendOffer(offer, false);
  });
  test('result', done => {
    expect.assertions(2);
    const result = msgs.results.blank;
    const listener = robonomicsOffer.onResult(msg => {
      expect(msg.account).toEqual(robonomicsOffer.account.address);
      expect(msg).toBeInstanceOf(Result);
      robonomicsOffer.messenger.off(listener);
      done();
    });
    robonomicsOffer.sendResult(result);
  });
});

describe('Contract', () => {
  const demand = msgs.demands.blank;
  const offer = msgs.offers.blank;
  const result = msgs.results.blank;

  beforeAll(() => {
    provider.run(robonomicsProvider, demand.model);
    demand.token = robonomicsDemand.xrt.address;
    demand.lighthouse = robonomicsDemand.lighthouse.address;
    offer.token = robonomicsOffer.xrt.address;
    offer.lighthouse = robonomicsOffer.lighthouse.address;
  });

  test('approve', done => {
    expect.assertions(1);
    robonomicsDemand.xrt.send
      .approve(robonomicsDemand.factory.address, demand.cost * 2, {
        from: robonomicsDemand.account.address,
        gas: 3000000
      })
      .then(() =>
        robonomicsDemand.xrt.call.allowance(
          robonomicsDemand.account.address,
          robonomicsDemand.factory.address
        )
      )
      .then(r => {
        expect(demand.cost * 2).toEqual(Number(r));
        done();
      });
  });
  test('liability demand', done => {
    expect.assertions(1);
    robonomicsDemand
      .sendDemand(demand)
      .then(liability => liability.getInfo())
      .then(info => {
        expect(info.promisee).toEqual(robonomicsDemand.account.address);
        done();
      });
    robonomicsOffer.sendOffer(offer, false);
  });
  test('liability result', done => {
    expect.assertions(4);
    let liability;
    robonomicsDemand.sendDemand(demand, false);
    robonomicsOffer
      .sendOffer(offer)
      .then(r => {
        liability = r;
        return liability.getInfo();
      })
      .then(info => {
        expect(info.promisor).toEqual(robonomicsOffer.account.address);
      })
      .then(() => {
        result.liability = liability.address;
        robonomicsOffer.onResult(msg => {
          expect(msg.account).toEqual(robonomicsOffer.account.address);
          expect(msg).toBeInstanceOf(Result);
        });
        liability.onResult().then(r => {
          expect(r).toEqual(result.result);
          done();
        });
        robonomicsOffer.sendResult(result);
      });
  });
});
