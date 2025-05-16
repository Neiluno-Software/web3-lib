import axios from "axios";
import { Network } from "../../networks";
import { chainId } from "./constants";
import { swingGetTokenAddress } from "../swing";
import { Web3Token, web3TokenGetAddress } from "../../token";
import { web3DefaultAddress, web3RawAmountOfNative } from "../../common";
import { Numbers } from "web3";

const deUrl = "https://dln.debridge.finance/v1.0/dln"

export async function dlnCreateOrder(
  srcChain: Network,
  srcAddr: string,
  _srcToken: string,
  amount: Numbers,
  dstChain: Network,
  dstAddr: string,
  _dstToken: string
): Promise<any> {
  let srcToken = await web3TokenGetAddress(srcChain, _srcToken)
  if (srcToken === 'NativeToken') {
    srcToken = web3DefaultAddress(srcChain)
  }
  let dstToken = await web3TokenGetAddress(dstChain, _dstToken)
  if (dstToken === 'NativeToken') {
    dstToken = web3DefaultAddress(dstChain)
  }

  try {
    const response = await axios.get(
      `${deUrl}/order/create-tx`,
      {
        params: {
          srcChainId: chainId[srcChain],
          srcChainTokenIn: srcToken,
          srcChainTokenInAmount: amount,
          dstChainId: chainId[dstChain],
          dstChainTokenOut: dstToken,
          dstChainTokenOutAmount: "auto",
          dstChainTokenOutRecipient: dstAddr,
          srcChainOrderAuthorityAddress: srcAddr,
          dstChainOrderAuthorityAddress: dstAddr,
          senderAddress: srcAddr,
          prependOperatingExpenses: true,
          affiliateFee:0.1,
          affiliateFeeBeneficiary: srcAddr,
          referralCode: 31805
        }
      }
    )
  
    const respData = response.data
    const gasUSD = respData.estimation.srcChainTokenIn.approximateUsdValue - respData.estimation.srcChainTokenIn.originApproximateUsdValue
    const totalFee = respData.estimation.srcChainTokenIn.approximateUsdValue - respData.estimation.dstChainTokenOut.approximateUsdValue
    const bridgeFee = totalFee - gasUSD
    return {
      routes:[
        {
          quote: {
            decimals: respData.estimation.dstChainTokenOut.decimals,
            amount: respData.estimation.dstChainTokenOut.amount,
            amountUSD: respData.estimation.dstChainTokenOut.approximateUsdValue,
            bridgeFeeUSD: bridgeFee,
          },
          gasUSD: gasUSD,
          tx: respData.tx
        }
      ],
      fromToken: {
        address: respData.estimation.srcChainTokenIn.address,
        symbol: respData.estimation.srcChainTokenIn.symbol,
        name: respData.estimation.srcChainTokenIn.name,
        decimals: respData.estimation.srcChainTokenIn.decimals,
      },
      toToken: {
        address: respData.estimation.dstChainTokenOut.address,
        symbol: respData.estimation.dstChainTokenOut.symbol,
        name: respData.estimation.dstChainTokenOut.name,
        decimals: respData.estimation.dstChainTokenOut.decimals,
      }
    }
    // console.log(response.data)
  } catch(error:any) {
    return undefined
  }
}