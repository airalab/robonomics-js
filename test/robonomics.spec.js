import Web3 from "web3";
import Robonomics, { MessageProviderIpfs } from "../src/index";
import Demand from "../src/messenger/message/demand";
import Offer from "../src/messenger/message/offer";
import Result from "../src/messenger/message/result";
import ipfs from "./helper/ipfs";
import * as msgs from "./helper/msg";
import provider from "./helper/provider";
import config from "./config.json";

const providerWeb3 = new Web3.providers.WebsocketProvider(
  config.robonomics.web3.provider
);
const web3 = new Web3(providerWeb3);

jest.setTimeout(20000);

const robonomicsProvider = new Robonomics({
  web3,
  account: {
    privateKey: config.accounts.provider.privateKey
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab797'
});
const robonomicsOffer = new Robonomics({
  web3,
  account: {
    privateKey: config.accounts.offer.privateKey
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab797'
});
const robonomicsDemand = new Robonomics({
  web3,
  account: {
    privateKey: config.accounts.demand.privateKey
  },
  ens: { address: config.robonomics.ens },
  messageProvider: new MessageProviderIpfs(ipfs)
  // lighthouse: 'airalab797'
});

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

const name = "airalab" + randomInteger(1, 1000);
const stake = 1000;

beforeAll(() => {
  return Promise.all([
    robonomicsDemand.ready(),
    robonomicsOffer.ready(),
    robonomicsProvider.ready()
  ]).then(() => {
    return Promise.all([
      robonomicsDemand.xrt.methods
        .transfer(robonomicsOffer.account.address, 1000)
        .send({
          from: robonomicsDemand.account.address,
          gas: 3000000
        }),
      robonomicsDemand.xrt.methods
        .transfer(robonomicsProvider.account.address, 1000)
        .send({
          from: robonomicsDemand.account.address,
          gas: 3000000
        })
    ]);
  });
});

afterAll(() => {
  setTimeout(() => {
    providerWeb3.disconnect();
  }, 1000);
});

describe("Balances", () => {
  test("check", async () => {
    expect.assertions(3);
    const balanceDemand = await robonomicsDemand.xrt.methods
      .balanceOf(robonomicsDemand.account.address)
      .call();
    expect(Number(balanceDemand)).toBeGreaterThanOrEqual(1000);

    const balanceOffer = await robonomicsOffer.xrt.methods
      .balanceOf(robonomicsOffer.account.address)
      .call();
    expect(Number(balanceOffer)).toBeGreaterThanOrEqual(1000);

    const balanceProvider = await robonomicsProvider.xrt.methods
      .balanceOf(robonomicsProvider.account.address)
      .call();
    expect(Number(balanceProvider)).toBeGreaterThanOrEqual(1000);
  });
});

describe("Robonomics", () => {
  test("create lighthouse", done => {
    expect.assertions(1);
    const watcher = robonomicsProvider.factory.onLighthouse(
      (error, lighthouse) => {
        watcher.unsubscribe();
        console.log(name, lighthouse.address);
        robonomicsProvider.setLighthouse(lighthouse);
        robonomicsDemand.setLighthouse(lighthouse);
        robonomicsOffer.setLighthouse(lighthouse);
        expect(name).toEqual(name);
        done();
      }
    );
    robonomicsProvider.factory.methods.createLighthouse(stake, 10, name).send({
      from: robonomicsProvider.account.address,
      gas: 3000000
    });
  });
  test("refill", async () => {
    expect.assertions(2);

    await robonomicsProvider.xrt.methods
      .approve(robonomicsProvider.lighthouse.address, stake)
      .send({
        from: robonomicsProvider.account.address,
        gas: 3000000
      });

    const allowance = await robonomicsProvider.xrt.methods
      .allowance(
        robonomicsProvider.account.address,
        robonomicsProvider.lighthouse.address
      )
      .call();
    expect(stake).toEqual(Number(allowance));

    await robonomicsProvider.lighthouse.methods.refill(stake).send({
      from: robonomicsProvider.account.address,
      gas: 3000000
    });

    const stakes = await robonomicsProvider.lighthouse.methods
      .stakes(robonomicsProvider.account.address)
      .call();
    expect(stake).toEqual(Number(stakes));
  });
});

describe("Messages", () => {
  test("demand", done => {
    expect.assertions(2);
    const demand = msgs.demands.blank;
    demand.token = robonomicsDemand.xrt.address;
    demand.lighthouse = robonomicsDemand.lighthouse.address;
    const listener = robonomicsDemand.onDemand(demand.model, msg => {
      expect(msg.sender).toEqual(robonomicsDemand.account.address);
      expect(msg).toBeInstanceOf(Demand);
      robonomicsDemand.messenger.off(listener);
      done();
    });
    robonomicsDemand.sendDemand(demand, false);
  });
  test("offer", done => {
    expect.assertions(2);
    const offer = msgs.offers.blank;
    offer.token = robonomicsOffer.xrt.address;
    offer.lighthouse = robonomicsOffer.lighthouse.address;
    const listener = robonomicsOffer.onOffer(offer.model, msg => {
      expect(msg.sender).toEqual(robonomicsOffer.account.address);
      expect(msg).toBeInstanceOf(Offer);
      robonomicsOffer.messenger.off(listener);
      done();
    });
    robonomicsOffer.sendOffer(offer, false);
  });
  test("result", done => {
    expect.assertions(1);
    const result = msgs.results.blank;
    const listener = robonomicsOffer.onResult(msg => {
      // expect(msg.sender).toEqual(robonomicsOffer.account.address);
      expect(msg).toBeInstanceOf(Result);
      robonomicsOffer.messenger.off(listener);
      done();
    });
    robonomicsOffer.sendResult(result);
  });
});

describe("Contract", () => {
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

  test("approve", done => {
    expect.assertions(1);
    robonomicsDemand.xrt.methods
      .approve(robonomicsDemand.factory.address, demand.cost * 2)
      .send({
        from: robonomicsDemand.account.address,
        gas: 3000000
      })
      .then(() =>
        robonomicsDemand.xrt.methods
          .allowance(
            robonomicsDemand.account.address,
            robonomicsDemand.factory.address
          )
          .call()
      )
      .then(r => {
        expect(demand.cost * 2).toEqual(Number(r));
        done();
      });
  });
  test("liability demand", async () => {
    expect.assertions(1);
    await robonomicsOffer.sendOffer(offer, false);
    const liability = await robonomicsDemand.sendDemand(demand);
    const info = await liability.getInfo();
    expect(info.promisee).toEqual(robonomicsDemand.account.address);
  });
  test("liability result", done => {
    expect.assertions(3);
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
          // expect(msg.account).toEqual(robonomicsOffer.account.address);
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
