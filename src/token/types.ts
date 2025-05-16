import { Numbers } from "web3"

export interface Web3TokenInfo {
  name?: string,
  symbol: string,
  address: string,
  decimals: number,
  totalSupply: number
}

export interface Web3TokenBalanceInfo {
  name: string,
  symbol: string,
  balance: Numbers,
  balanceInUSD: number
}
