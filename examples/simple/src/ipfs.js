import IPFS from 'ipfs'

const ipfs = () => {
  const config = {
    repo: 'ipfs-repo/aira-js/simple',
    EXPERIMENTAL: {
      pubsub: true,
    },
    config: {
      Addresses: {
        Swarm: [
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
        ]
      },
      Bootstrap: [
      ],
    }
  }
  return new IPFS(config)
}

export default ipfs
