import { Web3TokenInfo } from "../token";

export interface Web3WalletPortfolio {
  balance: number,
  balanceInUsd?: number,
  tokens: {
    name: string,
    symbol: string,
    address: string,
    decimals?: number,
    balance?: number,
    balanceInUsd?: number
  }[]
}