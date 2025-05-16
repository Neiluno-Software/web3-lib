import Web3 from "web3";
import { ChainType } from "../networks";
import { isAddress } from "web3-validator";
import { solAddrIsValid } from "dv-sol-lib";

export function web3ChainOfAddr(tokenAddr: string): ChainType {
  // Ensure tokenAddr conforms to EVM address format
  if (isAddress(tokenAddr))
    return 'ethereum'
  if (solAddrIsValid(tokenAddr))
    return 'solana'
  return 'unknown'
}