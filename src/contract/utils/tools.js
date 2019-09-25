import Promise from 'bluebird';

export const watchTx = (web3, tx) => {
  const transactionReceiptAsync = (resolve, reject) => {
    web3.eth.getTransactionReceipt(tx, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt === null || (receipt.status === '0x1' && receipt.blockNumber === null)) {
        setTimeout(() => transactionReceiptAsync(resolve, reject), 5000);
      } else {
        resolve(receipt);
      }
    });
  };
  if (Array.isArray(tx)) {
    return Promise.all(tx.map(oneTx => watchTx(web3, oneTx)));
  } else if (typeof tx === 'string') {
    return new Promise(transactionReceiptAsync);
  }
  throw new Error(`Invalid Type: ${tx}`);
};
