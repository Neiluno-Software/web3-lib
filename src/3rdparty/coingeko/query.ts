
import axios from "axios"
import { readFileSync } from "fs"
import path from "path"
import { Network } from "../../networks"
import { Web3TokenInfo } from "../../token"
import { web3IsAddressValid } from "../../address"

const apiKey = process.env.COINGEKO_API || ""
const gekoUrl = "https://api.coingecko.com/api/v3"

function getTokenIdBySymbol(symbol: string, network: string): string | undefined {

  switch (symbol.toLowerCase()) {
    case 'usdc':
      return 'usd-coin'

    case 'usdt':
      return 'tether'

    default:
      break;
  }

  const fdata = readFileSync('coinlist.json', { encoding: "utf-8" })
  const coinlist = JSON.parse(fdata)

  let nameInc = "????"
  switch (network.toUpperCase()) {
    case 'BNB':
    case 'BSC':
      nameInc = "(BNB Smart Chain)"
      break;

    case 'ETHEREUM':
    case 'ETH':
    case 'ETHER':
      break
    default:
      break;
  }

  return coinlist.find((c: any) => c.symbol === symbol && c.name.includes(nameInc))?.id
}

export function coingekoGetTokenInfo(network: Network, tokenId: string): Web3TokenInfo|undefined {
  let platformName = ""
  switch (network) {
    case 'BSC':
      platformName = "binance-smart-chain"
      break;
    default:
      platformName = network.toLowerCase()
      break;
  }
  const filePath = path.join(__dirname, 'coinlist.json');
  const fdata = readFileSync(filePath, { encoding: "utf-8" })
  const coinlist = JSON.parse(fdata)
  let destCoinData
  
  if (web3IsAddressValid(network, tokenId))
    destCoinData = coinlist.find((c: any) => (c.symbol.toLowerCase() === tokenId.toLowerCase()) && c.platforms[platformName])
  else
    destCoinData = coinlist.find((c: any) => c.platforms[platformName] && c.platforms[platformName].toLowerCase() === tokenId.toLowerCase())
  if (!destCoinData)
    return undefined
  return {
    name: destCoinData.name,
    symbol: destCoinData.symbol,
    address: destCoinData.platforms[platformName],
    decimals: 0,
    totalSupply: 0
  }
}

export async function coingekoGetTokenAddress(network: string, tokenName: string): Promise<string | undefined> {
  let platformName = ""
  switch (network.toUpperCase()) {
    case "ETHEREUM":
    case "ETHER":
    case "ETH":
      platformName = 'ethereum'
      break;

    case 'BNB':
    case 'BSC':
    case 'BINANCE':
      platformName = "binance-smart-chain"
      break

    case 'SOLANA':
    case 'SOL':
      platformName = "solana"
      break

    case "POLYGON":
      platformName = "polygon-pos"
      break

    case "TRON":
      platformName = "tron"
      break

    case 'ARBITRUM':
      platformName = "arbitrum-one"
      break

    default:
      platformName = network.toLowerCase()
      break
  }

  const filePath = path.join(__dirname, 'coinlist.json');
  const fdata = readFileSync(filePath, { encoding: "utf-8" })
  const coinlist = JSON.parse(fdata)

  // const tList = coinlist.filter((c:any) => c.symbol === tokenName)
  // const tResult = tList.find((t:any) => t.platforms[platformName] ? true : false)
  // console.log(tResult)

  const destCoinData = coinlist.find((c: any) => (c.symbol.toLowerCase() === tokenName.toLowerCase()) && c.platforms[platformName])
  if (!destCoinData)
    return undefined
  return destCoinData.platforms[platformName]
}
