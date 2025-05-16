import { evmAddrIsValid } from "dv-evm-lib"
import { alchemyGetTokenInfo, alchemyGetTokenPrice, coingekoGetTokenAddress, coingekoGetTokenInfo, coinmarketGetTokenAddress, swingGetTokenInfo } from "../3rdparty"
import { NATIVE_COIN_LIST, web3NetNormalizeName } from "../networks";
import { solAddrIsValid } from "dv-sol-lib";
import { Network } from '../networks/constants';
import { Web3TokenInfo } from "./types";
import { Web3Token } from "./helper";

export function web3TokenIsNative(_network: string, symbol: string): boolean {
  const network = web3NetNormalizeName(_network)
  if (!network)
    throw new Error(`Unsupported chain network: ${_network}`)
  
  if (NATIVE_COIN_LIST[network].includes(symbol.toUpperCase()))
    return true
  return false
}

export async function web3TokenGetAddress(network: string, tokenId: string): Promise<string|undefined> {
  let tokenAddr

  if (evmAddrIsValid(tokenId))
    return tokenId

  if (solAddrIsValid(tokenId))
    return tokenId

  if (web3TokenIsNative(network, tokenId))
    return 'NativeToken'

  tokenAddr = await coingekoGetTokenAddress(network, tokenId)
  if (tokenAddr)
    return tokenAddr
  
  tokenAddr = await coinmarketGetTokenAddress(network, tokenId)
  if (tokenAddr)
    return tokenAddr

  return undefined
}

export async function web3TokenGetInfo(network: Network, tokenId: string): Promise<Web3TokenInfo> {
  let tokenInfo = swingGetTokenInfo(network, tokenId)
  if (tokenInfo)
    return tokenInfo
  
  tokenInfo = coingekoGetTokenInfo(network, tokenId)
  if (tokenInfo)
    return tokenInfo

  tokenInfo = await alchemyGetTokenInfo(network, tokenId)
  if (tokenInfo)
    return tokenInfo
  throw new Error('Cannot get the token info!')
}

export async function web3TokenPrice(network: Network, tokenId: string): Promise<number> {
  const price = await alchemyGetTokenPrice(network, tokenId)
  if (price)
    return price
  return 0
}

export async function web3TokenDecimals(network: Network, tokenId: string): Promise<number> {
  const tokenInfo = await web3TokenGetInfo(network, tokenId)
  return tokenInfo.decimals
}
