import utils from "web3-utils";
import Account from "./account";
import ENS from "./contract/ens";
import XRT from "./contract/xrt";
import Factory from "./contract/factory";
import Lighthouse from "./contract/lighthouse";
import Messenger from "./messenger/messenger";
import Demand from "./messenger/message/demand";
import Offer from "./messenger/message/offer";

export default class Robonomics {
  constructor(config = {}) {
    this.web3 = null;
    this.account = null;
    this.ens = null;
    this.messageProvider = null;
    this.xrt = null;
    this.factory = null;
    this.lighthouse = null;
    this.messenger = null;
    this.load = [];
    this.init(config);
  }

  init(config) {
    if (config.web3) {
      this.setWeb3(config.web3);
    } else {
      throw new Error("Bad config web3");
    }
    if (config.account) {
      this.initAccount(config.account);
    }
    if (config.ens) {
      this.initEns(config.ens);
      this.load.push(this.initXrt());
      this.load.push(this.initFactory());
    }
    if (config.messageProvider) {
      this.setMessageProvider(config.messageProvider);
    }
    if (config.lighthouse) {
      this.load.push(this.initLighthouse(config.lighthouse));
    }
  }

  ready() {
    return Promise.all(this.load);
  }

  setWeb3(web3) {
    this.web3 = web3;
  }

  setAccount(account) {
    this.account = account;
    if (this.web3.currentProvider.isMetaMask) {
      this.account.setSigner(msg => {
        return new Promise((resolve, reject) => {
          this.web3.eth.sign(msg, this.account.address, (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          });
        });
      });
    }
  }

  initAccount(config) {
    this.setAccount(
      new Account(
        config.address || null,
        config.privateKey || null,
        config.isSignPrefix || true
      )
    );
  }

  setEns(ens) {
    this.ens = ens;
  }

  initEns(config) {
    if (this.web3 === null) {
      throw new Error("Require web3");
    }
    this.setEns(
      new ENS(
        this.web3,
        config.address || "0x314159265dD8dbb310642f98f50C066173C1259b",
        config.version || 5,
        config.suffix || "eth"
      )
    );
  }

  setMessageProvider(provider) {
    this.messageProvider = provider;
  }

  setXrt(xrt) {
    this.xrt = xrt;
  }

  async initXrt() {
    if (this.web3 === null) {
      throw new Error("Require web3");
    }
    if (this.ens === null) {
      throw new Error("Require ENS");
    }
    const xrt = new XRT(this.web3, await this.ens.addr("xrt"));
    this.setXrt(xrt);
    return xrt;
  }

  setFactory(factory) {
    this.factory = factory;
  }

  async initFactory() {
    if (this.web3 === null) {
      throw new Error("Require web3");
    }
    if (this.ens === null) {
      throw new Error("Require ENS");
    }
    const factory = new Factory(this.web3, await this.ens.addr("factory"));
    this.setFactory(factory);
    return factory;
  }

  setLighthouse(lighthouse) {
    this.lighthouse = lighthouse;
    this.initMessenger(lighthouse);
  }

  async initLighthouse(name) {
    if (this.web3 === null) {
      throw new Error("Require web3");
    }
    if (this.ens === null) {
      throw new Error("Require ENS");
    }
    let address = name;
    let ensName = name;
    if (utils.isAddress(name) === false) {
      address = await this.ens.addrLighthouse(name);
      ensName = this.ens.getUrl(name, "lighthouse");
    }
    const lighthouse = new Lighthouse(this.web3, address, ensName);
    this.setLighthouse(lighthouse);
    return lighthouse;
  }

  setMessenger(messenger) {
    this.messenger = messenger;
  }

  createChannel(lighthouse) {
    if (this.messageProvider === null) {
      throw new Error("Require messageProvider");
    }
    return this.messageProvider.createChannel(lighthouse.name);
  }

  createMessenger(channel) {
    if (this.account === null) {
      throw new Error("Require account");
    }
    return new Messenger(channel, this.account);
  }

  initMessenger(lighthouse) {
    const channel = this.createChannel(lighthouse);
    const messenger = this.createMessenger(channel);
    this.setMessenger(messenger);
    return messenger;
  }

  async send(type, data) {
    const message = Messenger.create(type, {
      sender: this.account.address,
      ...data
    });
    if (
      (message instanceof Demand || message instanceof Offer) &&
      message.nonce === 0
    ) {
      message.nonce = Number(
        await this.factory.methods.nonceOf(message.sender).call()
      );
    }
    return this.messenger.send(message);
  }

  sendDemand(data, isWatchLiability = true, cb = null) {
    return this.send(Messenger.TYPE_DEMAND, data).then(message => {
      if (cb !== null) {
        cb(message);
      }
      if (isWatchLiability) {
        return this.liabilityByDemand(message);
      }
      return true;
    });
  }

  liabilityByDemand(message) {
    return new Promise((resolve, reject) => {
      const watcher = this.onLiability((e, liability) => {
        if (e) {
          watcher.unsubscribe();
          return reject(e);
        }
        liability
          .equalDemand(message.getHash())
          .then(r => {
            if (r) {
              watcher.unsubscribe();
              resolve(liability);
            }
          })
          .catch(e => {
            watcher.unsubscribe();
            reject(e);
          });
      });
    });
  }

  onDemand(model, cb) {
    return this.messenger.onDemand((err, message) => {
      if (err) {
        return;
      }
      if (model === null || message.model === model) {
        cb(message);
      }
    });
  }

  sendOffer(data, isWatchLiability = true, cb = null) {
    return this.send(Messenger.TYPE_OFFER, data).then(message => {
      if (cb !== null) {
        cb(message);
      }
      if (isWatchLiability) {
        return this.liabilityByOffer(message);
      }
      return true;
    });
  }

  liabilityByOffer(message) {
    return new Promise((resolve, reject) => {
      const watcher = this.onLiability((e, liability) => {
        if (e) {
          watcher.unsubscribe();
          return reject(e);
        }
        liability
          .equalOffer(message.getHash())
          .then(r => {
            if (r) {
              watcher.unsubscribe();
              resolve(liability);
            }
          })
          .catch(e => {
            watcher.unsubscribe();
            reject(e);
          });
      });
    });
  }

  onOffer(model, cb) {
    return this.messenger.onOffer((err, message) => {
      if (err) {
        return;
      }
      if (model === null || message.model === model) {
        cb(message);
      }
    });
  }

  sendResult(data) {
    return this.send(Messenger.TYPE_RESULT, data);
  }

  onResult(cb) {
    return this.messenger.onResult((err, message) => {
      if (err) {
        return;
      }
      cb(message);
    });
  }

  onLiability(cb) {
    return this.factory.onLiability((e, liability) => {
      if (e) {
        cb(e);
        return;
      }
      liability.lighthouse().then(r => {
        if (r === this.lighthouse.address) {
          cb(null, liability);
        }
      });
    });
  }

  onFeedback(cb) {
    return this.messenger.onFeedback((err, message) => {
      if (err) {
        return;
      }
      cb(message);
    });
  }

  onPending(cb) {
    return this.messenger.onPending((err, message) => {
      if (err) {
        return;
      }
      cb(message);
    });
  }
}
