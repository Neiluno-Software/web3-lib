import { web3RawAmountOfNative } from '../../src/common';
export async function commonTest() {
  const ethAmount = web3RawAmountOfNative(0.1, 'ETHEREUM')
  const solAmount = web3RawAmountOfNative(0.1, 'SOLANA')
  console.table({ethAmount, solAmount})
}