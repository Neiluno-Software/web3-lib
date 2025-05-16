import path from "path";
import { Network } from "../../networks";
import { readFileSync } from "fs";
import { Web3TokenInfo } from "../../token";
import { web3IsAddressValid } from '../../address/index';

export async function swingGetTokenAddress(network: Network, tokenName: string): Promise<string | undefined> {
  const chain = network.toLowerCase()
  const filePath = path.join(__dirname, 'coinlist.json');
  const fdata = readFileSync(filePath, { encoding: "utf-8" })
  const coinlist = JSON.parse(fdata)
  const destCoinData = coinlist.find(
    (c: any) => (
      c.symbol === tokenName ||
      c.symbol === tokenName.toLowerCase() ||
      c.symbol === tokenName.toUpperCase()
    ) && c.chain === chain)

  if (!destCoinData)
    return undefined
  return destCoinData.address
}

export function swingGetTokenInfo(network: Network, tokenId: string): Web3TokenInfo | undefined {
  let platformName = ""
  platformName = network.toLowerCase()
  const filePath = path.join(__dirname, 'coinlist.json');
  const fdata = readFileSync(filePath, { encoding: "utf-8" })
  const coinlist = JSON.parse(fdata)

  let destCoinData
  if (web3IsAddressValid(network, tokenId))
    destCoinData = coinlist.find((c: any) => (c.address.toLowerCase() === tokenId.toLowerCase()) && c.chain === platformName)
  else
    destCoinData = coinlist.find((c: any) => (c.symbol.toLowerCase() === tokenId.toLowerCase()) && c.chain === platformName)
  if (!destCoinData)
    return undefined
  return {
    symbol: destCoinData.symbol,
    address: destCoinData.address,
    decimals: destCoinData.decimals,
    totalSupply: destCoinData.totalSupply
  }
}