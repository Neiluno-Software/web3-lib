import { alchemyGetAccountPortfolio } from "../3rdparty"
import { Network, web3NetChainTypeFromNet } from "../networks"
import {SolWalletHelper, SolTokenInfo} from 'dv-sol-lib'
import { Web3WalletPortfolio } from "../types"

export async function web3WalletPortfolio(network: Network, account: string, rpcUrl?: string): Promise<Web3WalletPortfolio|undefined> {
  const chainType = web3NetChainTypeFromNet(network)
  switch (chainType) {
    case 'ethereum':
      return await alchemyGetAccountPortfolio(network, account)
    case 'solana':
      const solWallet = new SolWalletHelper(rpcUrl!, account)
      const solWalletPt = await solWallet.getPortfolio()
      return {
        balance: solWalletPt.balance,
        balanceInUsd: solWalletPt.balanceInUsd,
        tokens: solWalletPt.tokens.map((tInf: SolTokenInfo) => ({
            name: tInf.name,
            symbol: tInf.symbol,
            address: tInf.address || "",
            balance: tInf.balance,
            balanceInUsd: tInf.balanceInUsd,
          }))
      }
    default:
      return undefined
  }
}