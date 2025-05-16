import { ethRpc, evmPrivKey, solanaRpc, solPrivKey } from '..';
import { Network, testnets } from '../../src/networks';
import { Web3Wallet } from '../../src/wallet/native';
import {web3WalletPortfolio} from '../../src';

async function evmWalletTest() {
  const network: Network = "ETHEREUM"
  const wallet = new Web3Wallet(ethRpc, network, evmPrivKey)
  const balance = await wallet.balanceOf()
  console.log(balance)

  await wallet.withdraw("0xE495AC8fc33fC8855A516d42dc4A563cd86D9045")
  // const tx = await wallet.transferNative("0x24ef62f5060D6BcAB0f0732B515137C508499126", 1)
  // console.log(`Transfer native succeeded. tx = `, tx)
}

async function solanaWalletTest() {
  const network: Network = "SOLANA"
  const wallet = new Web3Wallet(testnets[network], network, solPrivKey)
  const balance = await wallet.balanceOf()
  console.log(balance)

  const tx = await wallet.transferNative("GQApkyxEn1hGPxsgj2QMjKcPquwavAzhbBHphYZafp35", 1)
  console.log(`Transfer native succeeded. tx = `, tx)
}

export async function walletTest() {
  // await solanaWalletTest()
  await evmWalletTest()

  // const walletPortfolio = await web3WalletPortfolio('SOLANA', "7Sh4Rf2zFoSqkorTBqnhB6utJq1SJ53b4xq1g86Z2UBy", solanaRpc)
  // console.log(walletPortfolio)
}