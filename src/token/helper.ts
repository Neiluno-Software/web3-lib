import { Web3Base } from "../helpers";
import { Numbers } from "web3";
import { SolToken } from "dv-sol-lib";
import { EvmToken } from "dv-evm-lib";
import { Network } from "../networks";

export class Web3Token extends Web3Base {
  private tokenObj: any
  
  constructor(network: Network, rpcUrl: string, tokenAddr: string, signer?: string) {
    super(network, rpcUrl)
    switch (network) {
      case 'SOLANA':
        this.tokenObj = new SolToken(rpcUrl, tokenAddr, signer)
        break;
      default:
        this.tokenObj = new EvmToken(rpcUrl, tokenAddr, signer)
        break;
    }
  }

  async decimals(): Promise<number> {
    return await this.tokenObj.getDecimals()
  }

  async balanceOf(address?: string): Promise<Numbers[]> {
    try {
      return await this.tokenObj.balanceOf(address) 
    } catch (error) {
      return [BigInt(0), 0]
    }
  }

  async send(to: string, amount: Numbers): Promise<string|undefined> {
    return await this.tokenObj.send(to, amount)
  }
}