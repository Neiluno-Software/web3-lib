import { BigNumberish } from "alchemy-sdk";
import { dlnCreateOrder, swingQuoteRoute } from "../3rdparty";
import { Network } from "../networks";
import { Numbers } from "web3";
import { web3TokenDecimals } from "../token";

export async function web3BridgeRequest(
  fromChain: Network,
  fromUserAddress: string,
  fromToken: string,
  toChain: Network,
  toUserAddress: string,
  toToken: string,
  amount: Numbers
): Promise<any> {

  let tokenAmount: bigint
  if (typeof amount === 'number') {
    const decimals = await web3TokenDecimals(fromChain, fromToken)
    tokenAmount = BigInt(amount * (10 ** decimals))
  } else {
    tokenAmount = BigInt(amount)
  }

  const swingResult = await swingQuoteRoute(fromUserAddress, fromChain, fromToken, tokenAmount, toUserAddress, toChain, toToken) 
  if (swingResult && swingResult.routes.length !== 0) 
    return swingResult

  const dnlResult = await dlnCreateOrder(fromChain, fromUserAddress, fromToken, tokenAmount, toChain, toUserAddress, toToken)
  return dnlResult
}