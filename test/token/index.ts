import { EvmToken } from "dv-evm-lib"
import { web3ChainOfAddr, Web3Token, web3TokenGetAddress, web3TokenGetInfo, web3TokenPrice } from "../../src/token"
import { Network, testnets } from "../../src/networks"
import { ethRpc, evmPrivKey, solPrivKey } from ".."
import { web3IsAddressValid } from '../../src/address/index';
import { Transaction } from "web3";

async function tokenGetAddress(network: string, name: string) {
  const tokenAddr = await web3TokenGetAddress(network, name)
  console.log(`Token address of ${name} on ${network} chain is ${tokenAddr}`)
}

async function evmTokenTest() {
  const network: Network = 'ETHEREUM'
  const web3Token = new Web3Token(network, ethRpc, "0xdac17f958d2ee523a2206206994597c13d831ec7", evmPrivKey)
  console.table({
    decimals: await web3Token.decimals(),
    balance: await web3Token.balanceOf()
  })

  // const tx = await web3Token.send("0xd0040e2A7b3bb1378F28767e6a992D1a3106578D", 100)
  // console.log('token send tx = ', tx)
}

async function solTokenTest() {
  const web3Token = new Web3Token('SOLANA', testnets["SOLANA"], "G6gWyuD9tncE4nkrKaiWum7Sqka6YmnfJ2Bdc7HJ2RGZ", solPrivKey)
  console.table({
    decimals: await web3Token.decimals(),
    balance: await web3Token.balanceOf()
  })

  const tx = await web3Token.send("GQApkyxEn1hGPxsgj2QMjKcPquwavAzhbBHphYZafp35", 100)
  console.log('token send tx = ', tx)
}
export async function tokenTest() {
  const price = await web3TokenPrice('ETHEREUM', `AITHER`)
  console.log(price)
  // await solTokenTest()
  // await evmTokenTest()

  // const tokenInfo = await web3TokenGetInfo('ETHEREUM', 'usdc')
  // console.table(tokenInfo)
} 