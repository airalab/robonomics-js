import Web3 from "web3";
import Robonomics, { MessageProviderIpfs } from "../src/index";
import ipfs from "./helper/ipfs";
import * as msgs from "./helper/msg";

const providerWeb3 = new Web3.providers.WebsocketProvider(
  "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_KEY
);

const web3 = new Web3(providerWeb3);

jest.setTimeout(20000);

const robonomicsProvider = new Robonomics({
  web3,
  messageProvider: new MessageProviderIpfs(ipfs),
  lighthouse: "airalab"
});

beforeAll(() => {
  return robonomicsProvider.ready();
});

afterAll(() => {
  setTimeout(() => {
    providerWeb3.disconnect();
  }, 1000);
});

describe("Messages", () => {
  test("demand", () => {
    const demand = msgs.demands.blank;
    demand.token = robonomicsProvider.xrt.address;
    demand.lighthouse = robonomicsProvider.lighthouse.address;
    expect(robonomicsProvider.sendDemand(demand, false)).rejects.toThrow();
  });
});

describe("Contract", () => {
  test("lighthouse", async () => {
    expect(robonomicsProvider.lighthouse.address).toEqual(
      "0xD40AC7F1e5401e03D00F5aeC1779D8e5Af4CF9f1"
    );
  });
});
