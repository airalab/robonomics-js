import * as utils from 'web3-utils';
import { AbiCoder } from 'web3-eth-abi';
export { default as account } from 'eth-lib/lib/account';
export { default as hash } from 'eth-lib/lib/hash';

const abi = new AbiCoder();

export { utils, abi };
