import axios from "axios";
import { Numbers, Transaction } from "web3";
import { Network } from "../../networks";
import { web3TokenGetAddress, web3TokenGetInfo } from "../../token";
import { swingGetTokenInfo } from './query';

const apiUrl = "https://swap.prod.swing.xyz"
const defaultBridge = "openocean"

export async function swingQuoteRoute(
  from: string,
  fromNet: Network,
  _fromToken: string,
  _amount: Numbers,
  to: string,
  toNet: Network,
  _toToken: string,
  maxSlippage?: number,
  projectId?: string
): Promise<any> {
  const fromChain = fromNet.toLocaleLowerCase()
  const toChcain = toNet.toLocaleLowerCase()
  const fromToken = swingGetTokenInfo(fromNet, _fromToken)
  const toToken = swingGetTokenInfo(toNet, _toToken)

  if (!fromToken || !toToken)
    throw new Error('Unknown token!')

  // console.log(fromToken, toToken)
  const amount = typeof _amount === 'number' ? BigInt(_amount * (10 ** fromToken.decimals)) : _amount
  const response = await axios.get(`${apiUrl}/v0/transfer/quote`, {
    params: {
      fromChain: fromChain,
      fromTokenAddress: fromToken.address,
      fromUserAddress: from,
      toChain: toChcain,
      toTokenAddress: toToken.address,
      toTokenSymbol: toToken.symbol,
      toUserAddress: to,
      tokenAmount: amount,
      tokenSymbol: fromToken.symbol,
      maxSlippage: maxSlippage || 0.03,
      projectId: projectId || process.env.SWING_PROJECT_ID,
    },
    headers: {
      'x-swing-environment': 'production',
    },
  });

  return response.data
}

export async function swingTokenGetAllowance(
  from: string,
  fromNet: Network,
  _fromToken: string,
  toNet: Network,
  _toToken: string,
  _bridge?: string
): Promise<bigint> {

  const fromToken = swingGetTokenInfo(fromNet, _fromToken)
  const toToken = swingGetTokenInfo(toNet, _toToken)

  if (!fromToken || !toToken)
    throw new Error("Cannot get the token information")

  const response = await axios.get(`${apiUrl}/v0/transfer/allowance`, {
    params: {
      bridge: _bridge || defaultBridge,
      fromAddress: from,
      fromChain: fromNet.toLowerCase(),
      toChain: toNet.toLowerCase(),
      toTokenAddress: toToken.address,
      toTokenSymbol: toToken.symbol,
      tokenAddress: fromToken.address,
      tokenSymbol: fromToken.symbol
    },
    headers: {
      'x-swing-environment': 'production',
    },
  });

  return BigInt(response.data.allowance)
}

export async function swingTokenApprove(
  from: string,
  fromNet: Network,
  _fromToken: string,
  _amount: Numbers,
  toNet: Network,
  _toToken: string,
  _bridge?: string
): Promise<Transaction | undefined> {
  let amount: bigint
  const fromToken = swingGetTokenInfo(fromNet, _fromToken)
  const toToken = swingGetTokenInfo(toNet, _toToken)

  if (!fromToken || !toToken)
    throw new Error('Cannot get the token information')
  
  if (typeof _amount === 'number') {
    amount = BigInt(_amount * (10 ** fromToken.decimals))
  } else
    amount = BigInt(_amount)

  // Get allowance info
  const allowance = await swingTokenGetAllowance(
    from,
    fromNet,
    _fromToken,
    toNet,
    _toToken,
    _bridge)

  if (allowance >= amount)
    return undefined

  // fetch approve transaction data
  const response = await axios.get(`${apiUrl}/v0/transfer/approve`, {
    params: {
      bridge: _bridge || 'paraswap',
      fromAddress: from,
      fromChain: fromNet.toLowerCase(),
      toChain: toNet.toLowerCase(),
      toTokenAddress: toToken.address,
      toTokenSymbol: toToken.symbol,
      tokenAddress: fromToken.address,
      tokenAmount: amount.toString(),
      tokenSymbol: fromToken.symbol
    },
    headers: {
      'x-swing-environment': 'production',
    }
  })

  const txData = response.data.tx[0]
  // console.log(response.data)
  const tx: Transaction = {
    from: txData.from,
    to: txData.to,
    data: txData.data
  }
  return tx
}

export async function swingSwap(
  from: string,
  fromNet: Network,
  _fromToken: string,
  _amount: Numbers,
  to: string,
  toNet: Network,
  _toToken: string,
  route: any[]
): Promise<any> {
  const fromChain = fromNet.toLocaleLowerCase()
  const toChcain = toNet.toLocaleLowerCase()
  const fromToken = await web3TokenGetInfo(fromNet, _fromToken)
  const toToken = await web3TokenGetInfo(toNet, _toToken)

  if (!fromToken || !toToken)
    throw new Error('Cannot get the token information')

  const amount = typeof _amount === 'number' ? BigInt(_amount * (10 ** fromToken.decimals)) : _amount
  try {
    const response = await axios.post(`${apiUrl}/v0/transfer/send`,
      {
        fromChain: fromChain,
        fromTokenAddress: fromToken.address,
        fromUserAddress: from,
        toChain: toChcain,
        toTokenAddress: toToken.address,
        toTokenSymbol: toToken.symbol,
        toUserAddress: to,
        tokenAmount: amount.toString(),
        tokenSymbol: fromToken.symbol,
        route: route
      },
      {
        headers: {
          'x-swing-environment': 'production',
        },
      });

    return response.data.tx
  } catch (error) {
    if (axios.isAxiosError(error))
      throw new Error(error.response?.data.message || error.message)
    throw new Error('Error in fetching swap transaction.')
  }
}