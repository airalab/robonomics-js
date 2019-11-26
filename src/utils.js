import baseX from "base-x";
import utils from "web3-utils";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const base58 = baseX(BASE58);

export function setPrefix(hash) {
  return utils.soliditySha3(
    {
      type: "bytes",
      value: utils.stringToHex("\x19Ethereum Signed Message:\n32")
    },
    { type: "bytes", value: hash }
  );
}

export function hexToStr(hex) {
  const bytes = utils.hexToBytes(hex);
  return base58.encode(Buffer.from(bytes)).toString("utf8");
}

export function watchTx(web3, tx) {
  const transactionReceiptAsync = function(resolve, reject) {
    web3.eth.getTransactionReceipt(tx, function(error, receipt) {
      if (error) {
        reject(error);
      } else if (
        receipt === null ||
        (receipt.status === "0x1" && receipt.blockNumber === null)
      ) {
        setTimeout(function() {
          transactionReceiptAsync(resolve, reject);
        }, 5000);
      } else {
        resolve(receipt);
      }
    });
  };
  if (Array.isArray(tx)) {
    return Promise.all(
      tx.map(function(oneTx) {
        return watchTx(web3, oneTx);
      })
    );
  } else if (typeof tx === "string") {
    return new Promise(transactionReceiptAsync);
  }
  throw new Error(`Invalid Type: ${tx}`);
}
