import Promise from 'bluebird';
import Ipfs from './ipfs';

export default class IpfsApi extends Ipfs {
  constructor(ipfs) {
    super(ipfs);
  }

  ready() {
    return Promise.resolve(true);
  }
}
