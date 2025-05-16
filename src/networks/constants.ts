import { web3NetNormalizeName } from ".";

export type ChainType = 'ethereum' | 'solana' | 'unknown'
export type Network = 'ETHEREUM' | 'SOLANA' | 'BSC' | 'HOLESKY' | 'AVALANCHE' | 'POLYGON' | 'BASE'

export const NATIVE_COIN_LIST: Record<Network, string[]> = {
  ETHEREUM: ['ETH'],
  SOLANA: ['SOL', 'SOLANA'],
  BSC: ['BNB'],
  HOLESKY: ['ETH'],
  AVALANCHE: ['AVAX', 'AVALANCHE'],
  POLYGON: ['POL', 'MATIC', 'POLYGON'],
  BASE: ['ETH', 'BASE']
};

export const testnets: Record<Network, string> = {
  ETHEREUM: "https://ethereum-sepolia.publicnode.com",
  BSC: "https://bsc-testnet-rpc.publicnode.com",
  SOLANA: "https://api.devnet.solana.com",
  HOLESKY: "https://ethereum-holesky.publicnode.com",
  AVALANCHE: "https://avalanche-fuji.drpc.org",
  POLYGON: "https://endpoints.omniatech.io/v1/polygon-zkevm/testnet/public",
  BASE: "https://base-sepolia.publicnode.com"
}

export function web3NetChainTypeFromNet(network: Network): ChainType {
  switch (network) {
    case 'BSC':
    case 'ETHEREUM':
    case 'BSC':
    case 'HOLESKY':
    case 'BASE':
      return 'ethereum'

    case 'SOLANA':
      return 'solana'
    default:
      return 'unknown'
  }
}

export function web3ChainType(chain: string): ChainType {
  const network = web3NetNormalizeName(chain)
  if(!network)
    throw new Error('Unsupported chain!')
  return web3NetChainTypeFromNet(network)
}