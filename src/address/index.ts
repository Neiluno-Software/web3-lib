import { evmAddrIsValid } from "dv-evm-lib";
import { Network, web3NetChainTypeFromNet } from "../networks";
import { solAddrIsValid } from "dv-sol-lib";

export function web3IsAddressValid(network: Network, address: string): boolean {
  const chainType = web3NetChainTypeFromNet(network)
  switch (chainType) {
    case 'ethereum':
      return evmAddrIsValid(address)
    case 'solana':
      return solAddrIsValid(address)
    default:
      return false
  }
}