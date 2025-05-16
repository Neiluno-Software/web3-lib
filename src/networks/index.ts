import { Network } from "./constants"

export function web3NetNormalizeName(network: string): Network | undefined {
  if (!network)
    return undefined
  switch (network.toUpperCase()) {
    case 'ETHEREUM':
    case 'ETH':
      return 'ETHEREUM'

    case 'SOLANA':
    case 'SOL':
      return 'SOLANA'

    case 'BSC':
    case 'BNB':
    case 'BINANCE SMART CHAIN':
      return 'BSC'

    case 'HOLESKY':
      return 'HOLESKY'

    case 'AVALANCHE':
    case 'AVAX':
      return 'AVALANCHE'

    case 'POLYGON':
      return 'POLYGON'

    case 'BASE':
    case 'BASECHAIN':
      return 'BASE'

    default:
      return undefined
  }
}

export * from "./constants"