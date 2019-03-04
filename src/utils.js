import baseX from 'base-x';
import { utils } from './web3Utils';

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export const base58 = baseX(BASE58);

export const setPrefix = hash => {
  return utils.soliditySha3(
    {
      type: 'bytes',
      value: utils.stringToHex('\x19Ethereum Signed Message:\n32')
    },
    { type: 'bytes', value: hash }
  );
};

export const hexToStr = hex => {
  const bytes = utils.hexToBytes(hex);
  return base58.encode(Buffer.from(bytes)).toString('utf8');
};
