import { Alchemy, GetTokenPriceByAddressResponse, Network, TokenMetadataResponse, TokenPriceByAddressResult, TokenPriceBySymbolResult } from "alchemy-sdk"
import { NATIVE_COIN_LIST, web3NetChainTypeFromNet, Network as Web3Network } from "../../networks/constants"
import { Web3TokenBalanceInfo, web3TokenGetInfo, Web3TokenInfo } from "../../token"
import { web3IsAddressValid } from "../../address"
import { EvmWeb3 } from "dv-evm-lib"
import { Web3WalletPortfolio } from "../../types"

const apiKey = process.env.ALCHEMY_API_KEY

function alchemyGetNetWork(net: Web3Network): Network | undefined {
  switch (net) {
    case 'ETHEREUM':
      return Network.ETH_MAINNET

    case 'AVALANCHE':
      return Network.AVAX_MAINNET

    case 'BSC':
      return Network.BNB_MAINNET

    case "HOLESKY":
      return Network.ETH_HOLESKY

    case "POLYGON":
      return Network.MATIC_MAINNET

    default:
      return undefined
  }
}

export async function alchemyGetTokenMeta(_network: Web3Network, tokenAddr: string): Promise<TokenMetadataResponse> {
  const network = alchemyGetNetWork(_network)
  const alchemy = new Alchemy({
    apiKey: apiKey,
    network: network
  })

  const resp = await alchemy.core.getTokenMetadata(tokenAddr)
  return resp
}

export async function alchemyGetTokenInfo(_network: Web3Network, tokenId: string): Promise<Web3TokenInfo | undefined> {
  if (!web3IsAddressValid(_network, tokenId))
    return undefined
  const meta = await alchemyGetTokenMeta(_network, tokenId)
  return {
    name: meta.name || undefined,
    symbol: meta.symbol!,
    decimals: meta.decimals!,
    address: tokenId,
    totalSupply: 0
  }
}

export async function alchemyGetAccountPortfolio(_network: Web3Network, wallet: string): Promise<Web3WalletPortfolio | undefined> {
  const network = alchemyGetNetWork(_network)
  if (!network)
    return undefined
  const alchemy = new Alchemy({
    apiKey: apiKey,
    network: network
  })

  const balances = (await alchemy.core.getTokenBalances(wallet)).tokenBalances
  const tokenInfos: any[] = []

  for (const bInfo of balances) {
    if (bInfo.error)
      continue
    try {
      const tokenInfo = await web3TokenGetInfo(_network, bInfo.contractAddress)
      if (tokenInfo) {
        const balance = Number(bInfo.tokenBalance!) / (10 ** tokenInfo.decimals)
        if (balance > 0) {
          tokenInfos.push({ ...tokenInfo, balance: balance })
        }
      }
    } catch (error) { }
  }

  const addresses = tokenInfos.map((t: any) => { return { network, address: t.address } })
  // console.log(addresses.length)
  const tprResp = await alchemy.prices.getTokenPriceByAddress(addresses.slice(0, 24))

  const tprInfo = tprResp.data.filter((tpr: any) => !tpr.error);
  const balanceInfo = tprInfo.map((tpr: TokenPriceByAddressResult) => {
    const tInfo = tokenInfos.find((tInfo: any) => tInfo.address === tpr.address)
    return {
      name: tInfo?.name || "",
      symbol: tInfo?.symbol || "",
      address: tInfo.address,
      balance: tInfo.balance,
      balanceInUsd: Number(tpr.prices[0].value) * tInfo.balance
    }
  })

  const nativeBalanceInRaw = await alchemy.core.getBalance(wallet)
  const nativeSymbol = NATIVE_COIN_LIST[_network][0]
  let nativeBalance: number = 0
  let nativeBalanceInUsd: number = 0
  switch (web3NetChainTypeFromNet(_network)) {
    case 'ethereum':
      nativeBalance = EvmWeb3.fromWei(BigInt(nativeBalanceInRaw.toString()))
      const nativePrice = await alchemy.prices.getTokenPriceBySymbol([nativeSymbol])
      nativeBalanceInUsd = nativeBalance * Number(nativePrice.data[0].prices[0].value)
      break;
    case 'solana':
      break;
  }
  return {
    balance: nativeBalance,
    balanceInUsd: nativeBalanceInUsd,
    tokens: balanceInfo.map((bInf: any) => ({
      address: bInf.address,
      name: bInf.name,
      symbol: bInf.symbol,
      balance: bInf.balance,
      balanceInUsd: bInf.balanceInUsd
    }))
  }
  // {
  //   name: nativeSymbol,
  //   symbol: nativeSymbol,
  //   balance: nativeBalance,
  //   balanceInUSD: nativeBalanceInUsd
  // },
  // ...balanceInfo]
}

export async function alchemyGetTokenPrice(_network: Web3Network, tokenId: string): Promise<number> {
  const network = alchemyGetNetWork(_network)
  if (!network)
    return 0
  const alchemy = new Alchemy({
    apiKey: apiKey,
    network: network
  })
  const priceInfo = await alchemy.prices.getTokenPriceBySymbol([tokenId])
  return Number(priceInfo.data[0].prices[0].value)
}