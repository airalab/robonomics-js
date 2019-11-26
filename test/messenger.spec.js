// import "regenerator-runtime/runtime";
import Account from "../src/account";
import Messenger from "../src/messenger/messenger";
import MessageProvider from "../src/messenger/provider/ipfs";
import Demand from "../src/messenger/message/demand";
import ipfs from "./helper/ipfs";
import config from "./config.json";

const account = new Account(null, config.accounts.demand.privateKey, false);
const provider = new MessageProvider(ipfs);
const channel = provider.createChannel("lighthouse.name");
const messenger = new Messenger(channel, account);

describe("Messenger", () => {
  test("create message valid", () => {
    const demand = Messenger.create(Messenger.TYPE_DEMAND, {
      model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
      objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
      token: "0x1",
      cost: 78923,
      lighthouse: "0x2",
      deadline: 789,
      sender: account.address
    });
    expect(demand).toBeInstanceOf(Demand);
  });
  test("off listener", done => {
    expect.assertions(1);
    const demand = Messenger.create(Messenger.TYPE_DEMAND, {
      model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
      objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
      token: account.address,
      cost: 78923,
      lighthouse: account.address,
      deadline: 1,
      sender: account.address
    });
    const listener = messenger.on((err, msg) => {
      expect(msg).toBeInstanceOf(Demand);
      messenger.off(listener);
      done();
    });
    messenger.send(demand);
  });
  test("on", done => {
    expect.assertions(1);
    const demand = Messenger.create(Messenger.TYPE_DEMAND, {
      model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
      objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
      token: account.address,
      cost: 78923,
      lighthouse: account.address,
      deadline: 2,
      sender: account.address
    });
    messenger.on((err, msg) => {
      expect(msg).toBeInstanceOf(Demand);
      done();
    });
    messenger.send(demand);
  });
  test("send bad message", () => {
    expect(messenger.send("test")).rejects.toThrow();
  });
});
