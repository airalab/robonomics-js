export const demands = {
  blank: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    token: "",
    cost: 1,
    lighthouse: "",
    validator: "0x0000000000000000000000000000000000000000",
    validatorFee: 0,
    deadline: 9999999,
  },
  valid: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    token: "0x60270F0BE920009Ba0fe32D81D63D1F498F42731",
    cost: 1,
    lighthouse: "0x3656aea8dd8e290083f8933ca5050141634cd947",
    validator: "0x0000000000000000000000000000000000000000",
    validatorFee: 0,
    deadline: 9999999,
    nonce: "0xd137fda4165af0ac9dc485a39d5010480ef95fa88de22d8419ee673dec0da8b3",
    signature: "0x870d7d95ddf681b7b80a2b505057b83602861ca97c56d9cdf74ec0d5746d404443cb3ed8abac84a5f65ccc9258f2e0b82a3d0ea51cc17d4d2d0400db750b709c1b"
  },
  valid2: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    token: "0x60270F0BE920009Ba0fe32D81D63D1F498F42731",
    // cost: "2000000000000000000000",
    // cost: 2000000000000000000000,
    // cost: 2e+21,
    cost: "2e+21",
    lighthouse: "0x3656aea8dd8e290083f8933ca5050141634cd947",
    validator: "0x0000000000000000000000000000000000000000",
    validatorFee: 0,
    deadline: 9999999,
    nonce: "0xd137fda4165af0ac9dc485a39d5010480ef95fa88de22d8419ee673dec0da8b3",
    signature: "0xa6ff944d1191dd496053c7a0e95036c20ac96dbdd5d9293422a934027be6638d653c0e10482ea2e6e8d50e2df6096550475fd3908033824f8a5e8eec3e079ce71c"
  },
  bad: {
    token: "0x60270F0BE920009Ba0fe32D81D63D1F498F42731",
    cost: 1,
    validator: "0x0000000000000000000000000000000000000000",
    validatorFee: 0,
    deadline: 9999999
  }
}

export const offers = {
  blank: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    token: "",
    cost: 1,
    validator: "0x0000000000000000000000000000000000000000",
    lighthouse: "",
    lighthouseFee: 0,
    deadline: 9999999,
  },
  valid: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    token: "0x60270F0BE920009Ba0fe32D81D63D1F498F42731",
    cost: 1,
    validator: "0x0000000000000000000000000000000000000000",
    lighthouse: "0x3656aea8dd8e290083f8933ca5050141634cd947",
    lighthouseFee: 0,
    deadline: 9999999,
    nonce: "0x6dd792b4849c3b16240c62116487bfb2560e7faa434275b3f60c93ff76d17755",
    signature: "0x80fb9137a1e5c79116dda8bc8224dd2c45a079ca8fd29b2b9dee09ce644a4ecd0f18f7ff68ed911ed8557a2999088cd53e9fdc479421c8e3a144ebed680581761b"
  },
  bad: {
    model: "QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW",
    objective: "Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm",
    cost: 1,
    validator: "0x0000000000000000000000000000000000000000",
    lighthouseFee: 0,
    deadline: 9999999
  }
}

export const results = {
  blank: {
    liability: "0x8Db2a3e681E166dC4b800C0100e74675c2e62D6F",
    success: true,
    result: "QmRnbvYL4ehmVnuXQbB54ZvSzrrWRxVsBBx1gKbDKLd6dK"
  },
  valid: {
    liability: "0x8Db2a3e681E166dC4b800C0100e74675c2e62D6F",
    success: true,
    result: "QmRnbvYL4ehmVnuXQbB54ZvSzrrWRxVsBBx1gKbDKLd6dK",
    signature: "0x7d2557bb5e891c255baf2a36b0335aaaf05f72cfc60117d0b7303716b74c97383a7f21817f6fa0b7c8f6be6c895c966c3c589efdd08896a2539b3a911f03da4c1c"
  }
}
