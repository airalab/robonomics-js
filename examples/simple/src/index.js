import Aira, { Provider } from 'aira-js'
import ipfs from './ipfs'

const aira = new Aira(null, new Provider(ipfs()))
aira.ready()
  .then(() => {
    console.log('run')

    const chanel = aira.chanel('aira_market')

    chanel.asks(msg => {
      console.log('new ask', msg)
      const acc = msg.recover()
      console.log('acc', acc);
    })

    chanel.bids(msg => {
      console.log('new bid', msg)
      const acc = msg.recover()
      console.log('acc', acc);
    })
  })
