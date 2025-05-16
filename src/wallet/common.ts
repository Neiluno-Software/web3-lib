import { evmWalletImport } from "dv-evm-lib";
import { solWalletImport } from "dv-sol-lib";

export function web3WalletAddress(pkey: string): string {
  const solWallet = solWalletImport(pkey)
  if (solWallet)
    return solWallet.publicKey.toBase58()

  const evmWallet = evmWalletImport(pkey)
  return evmWallet.address
}