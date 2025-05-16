import Web3 from "web3";
import { Network, web3NetChainTypeFromNet } from "../networks";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function web3RawAmountOfNative(amount: number, network: Network): bigint {
  const chainType = web3NetChainTypeFromNet(network)
  switch (chainType) {
    case 'ethereum':
      return BigInt(Web3.utils.toWei(amount, 'ether'))
    case 'solana':
      return BigInt(amount * LAMPORTS_PER_SOL)
    default:
      break
  }
  return BigInt(0)
}

export function web3DefaultAddress(network: Network): string {
  const chainType = web3NetChainTypeFromNet(network)
  switch (chainType) {
    case 'ethereum':
      return "0x0000000000000000000000000000000000000000"
    case 'solana':
      return "11111111111111111111111111111111"
    default:
      throw new Error('Unsupported chain!')
  }
}