import Account from "../src/account";
import config from "./config.json";
// import Promise from "bluebird";

const account = new Account(null, config.accounts.demand.privateKey, false);

// console.log(Promise);
// console.log(Promise.all);
// console.log(Promise.join);
// console.log(Promise.resolve);
// console.log(Promise.reject);
// console.log(Promise.promisify);

// const promiseA = new Promise(resolve => {
//   setTimeout(() => {
//     resolve("promiseA");
//   }, 3000);
// });
// const promiseB = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("promiseB");
//   }, 4000);
// });
// console.time();
// Promise.join(promiseA, promiseB, function(...r) {
//   console.log("r", r);
//   return r;
// })
//   .then(r => {
//     console.log("g", r);
//     console.timeEnd();
//   })
//   .catch(e => {
//     console.log("err", e);
//   });
// Promise.all([promiseA, promiseB])
//   .then(r => {
//     console.log("r", r);
//     return r;
//   })
//   .then(r => {
//     console.log("g", r);
//     console.timeEnd();
//   })
//   .catch(e => {
//     console.log("err", e);
//   });

describe("Account", () => {
  test("address by privateKey", () => {
    expect(config.accounts.demand.address).toEqual(account.address);
  });
  test("sign", done => {
    expect.assertions(1);
    account.sign("0x01").then(r => {
      expect(
        "0x734c2a11f55018675c4213c68baa6e79fbae05d0a31d3908763beb3407e6d51e6a741c07ad17d91d65b139dd0bdf9cd929326feb43e6c72db8096059b03e838d1c"
      ).toEqual(r);
      done();
    });
  });
  test("recovery", () => {
    expect.assertions(1);
    const address = account.recovery(
      "0x01",
      "0x734c2a11f55018675c4213c68baa6e79fbae05d0a31d3908763beb3407e6d51e6a741c07ad17d91d65b139dd0bdf9cd929326feb43e6c72db8096059b03e838d1c"
    );
    expect(account.address).toEqual(address);
  });
});
