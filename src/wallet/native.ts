import { Numbers, Web3Account } from "web3";
import { Network, web3NetChainTypeFromNet } from "../networks";
import { EvmWallet } from "dv-evm-lib";
import { SolTokenInfo, SolWalletHelper } from "dv-sol-lib";
import { Web3WalletPortfolio } from "../types";
import { alchemyGetAccountPortfolio } from "../3rdparty";

export class Web3Wallet {
  private wallet: EvmWallet | SolWalletHelper
  private network: Network
  constructor(rpc: string, network: Network, pkey: string) {
    switch (network) {
      case "ETHEREUM":
      case "BSC":
      case "HOLESKY":
      case "AVALANCHE":
      case "POLYGON":
      case "BASE":
        this.wallet = new EvmWallet(rpc, pkey)
        break
      case "SOLANA":
        this.wallet = new SolWalletHelper(rpc, pkey)
        break
    }
    if (!this.wallet)
      throw new Error('Invalid private key!')
    this.network = network
  }

  get address(): string {
    return this.wallet.address
  }

  async transferNative(to: string, amount: number): Promise<string | undefined> {
    return await this.wallet.transferBalance(to, amount)
  }

  async balanceOf(address?: string): Promise<number> {
    return this.wallet.balanceOf(address)
  }

  async portfolio(): Promise<Web3WalletPortfolio|undefined> {
    const chainType = web3NetChainTypeFromNet(this.network)
    switch (chainType) {
      case 'ethereum':
        return await alchemyGetAccountPortfolio(this.network, this.address)
      case 'solana':
        const solWalletPt = await (this.wallet as SolWalletHelper).getPortfolio()
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

  async withdraw(to: string): Promise<string | undefined> {
    switch (this.network) {
      case "SOLANA":
        return await (this.wallet as SolWalletHelper).withdraw(to)
        break;
      case "ETHEREUM":
      case "BSC":
      case "HOLESKY":
      case "AVALANCHE":
      case "POLYGON":
      case "BASE":
        const portfolio = await this.portfolio()
        if (!portfolio)
          return undefined
        const tokenList = portfolio.tokens.map(t => t.address)
        // console.log(tokenList)
        await (this.wallet as EvmWallet).withdraw(to, tokenList)
      default:
        return undefined
    }
  }

  async distribute(amount: number, wallets: string[]): Promise<string[]> {
    const transferAmount = amount / wallets.length
    const txHashes: string[] = []
    for(const to of wallets) {
      const tx = await this.transferNative(to, transferAmount)
      if (tx)
        txHashes.push(tx)
    }
    return txHashes
  }
}