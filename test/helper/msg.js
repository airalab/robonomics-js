export const demands = {
  blank: {
    model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
    objective: 'Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm',
    token: '',
    cost: 1,
    lighthouse: '',
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999
  },
  valid: {
    model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
    objective: 'Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm',
    token: '0x60270F0BE920009Ba0fe32D81D63D1F498F42731',
    cost: 1,
    lighthouse: '0x3656aea8dd8e290083f8933ca5050141634cd947',
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999,
    nonce: 0,
    sender: '0xbb1DA37368aA2CB7E688EBEe58c54C10Bf56d2E3',
    signature:
      '0xa9a29cdfa6d264b3733b135b99f75fd623fd5db6f9d84887a73dfe9bd7f08cce0a6b42d377cd558e2f968d3ae776a4eea99d66587b6b262d40240d5f360796eb1b'
  },
  bad: {
    token: '0x60270F0BE920009Ba0fe32D81D63D1F498F42731',
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    validatorFee: 0,
    deadline: 9999999
  }
};

export const offers = {
  blank: {
    model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
    objective: 'Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm',
    token: '',
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouse: '',
    lighthouseFee: 0,
    deadline: 9999999,
    sender: '0x302aA0306400a1469A7C2c71Ed6d31c3E1B3826c'
  },
  valid: {
    model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
    objective: 'Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm',
    token: '0x60270F0BE920009Ba0fe32D81D63D1F498F42731',
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouse: '0x3656aea8dd8e290083f8933ca5050141634cd947',
    lighthouseFee: 0,
    deadline: 9999999,
    nonce: 0,
    sender: '0x302aA0306400a1469A7C2c71Ed6d31c3E1B3826c',
    signature:
      '0xc82bcf646920293156c067edbcfd2296a4c383e3bdbfdc33099d9168c5289d0a40a31734aef97737b7f6957334c8813f06830b99bceea0ae5d41f503d34700541b'
  },
  bad: {
    model: 'QmfCcLKrTCuXsf6bHbVupVv4zsbs6kjqTQ7DRftGqMLjdW',
    objective: 'Qmbm3o2wkqseSEi5F69CPAuDrsKnrwTJ3HN5FVLPgLHKUm',
    cost: 1,
    validator: '0x0000000000000000000000000000000000000000',
    lighthouseFee: 0,
    deadline: 9999999
  }
};

export const results = {
  blank: {
    liability: '0x8Db2a3e681E166dC4b800C0100e74675c2e62D6F',
    success: true,
    result: 'QmRnbvYL4ehmVnuXQbB54ZvSzrrWRxVsBBx1gKbDKLd6dK'
  },
  valid: {
    liability: '0x8Db2a3e681E166dC4b800C0100e74675c2e62D6F',
    success: true,
    result: 'QmRnbvYL4ehmVnuXQbB54ZvSzrrWRxVsBBx1gKbDKLd6dK',
    signature:
      '0x769c7a16a73b743e92901d9490be616af1661ab588b92bff07dfea906678a90e4fea8399e244415426e946ac5b95858e993e86df46259547c579c094fc2f88e01b'
  }
};
