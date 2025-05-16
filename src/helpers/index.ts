import { evmWalletImport, EvmWeb3 } from "dv-evm-lib";
import { Network, web3NetChainTypeFromNet } from "../networks";
import { solWalletImport, SolWeb3 } from "dv-sol-lib";
import { VersionedTransaction } from "@solana/web3.js";

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    const byte = hex.slice(i, i + 2);
    bytes[i / 2] = parseInt(byte, 16);
  }

  return bytes;
}

export class Web3Base {
  private network: Network
  public rpc: string
  constructor(network: Network, rpcUrl: string) {
    this.network = network
    this.rpc = rpcUrl
  }

  async sendTransaction(pkey: string, transaction: any): Promise<string | undefined> {
    const chainType = web3NetChainTypeFromNet(this.network)
    let signer
    switch (chainType) {
      case 'ethereum':
        const evmWeb3 = new EvmWeb3(this.rpc)
        signer = evmWalletImport(pkey)
        return await evmWeb3.sendTransaction(signer, transaction)

      case 'solana':
        signer = solWalletImport(pkey)
        if (!signer) return undefined
        const solWeb3 = new SolWeb3(this.rpc)
        const rawData = Uint8Array.from(Buffer.from(transaction.data, "hex"));
        const versionedTr = VersionedTransaction.deserialize(rawData)
        return await solWeb3.sendVersionedTransaction(versionedTr, signer)
        
      default:
        break;
    }
    return undefined
  }
}