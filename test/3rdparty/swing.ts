import { swingGetTokenAddress, swingGetTokenInfo, swingQuoteRoute, swingSwap, swingTokenApprove, swingTokenGetAllowance } from "../../src/3rdparty";

export async function swingTest() {

  // const tokenInfo = swingGetTokenInfo('BSC', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d')
  // console.table(tokenInfo)

  // const routeInfo = await swingQuoteRoute(
  //   "CViufv71DbGMmCKsMLBNunNJfuyQhYWgUA9xfrwazP5i",
  //   'SOLANA',
  //   'SOL',
  //   0.001,
  //   "0x4b80c27d6E9cd1e397322D11e01ed9AdFF0b6cef",
  //   'ETHEREUM',
  //   'USDT'
  // )
  
  // console.log(routeInfo)
  // routeInfo.routes.forEach((route: any) => {
  //   console.log(route)
  // });

  // await swingTokenGetAllowance(
  //   "0x24ef62f5060D6BcAB0f0732B515137C508499126",
  //   'ETHEREUM',
  //   'usdc',
  //   'ETHEREUM',
  //   'aave'
  // )

  const txData = await swingTokenApprove(
    "0x24ef62f5060D6BcAB0f0732B515137C508499126",
    'ETHEREUM',
    'USDT',
    100,
    'ETHEREUM',
    'ETH'
  )
  console.log(txData)

  // const txData = await swingSwap(
  //   "CViufv71DbGMmCKsMLBNunNJfuyQhYWgUA9xfrwazP5i",
  //   "SOLANA",
  //   "SOL",
  //   0.001,
  //   "CViufv71DbGMmCKsMLBNunNJfuyQhYWgUA9xfrwazP5i",
  //   "SOLANA",
  //   "USDC",
  //   [{ "bridge": "jupiter", "bridgeTokenAddress": "11111111111111111111111111111111", "steps": ["allowance", "approve", "send"], "path": [{ "fromToken": { "address": "11111111111111111111111111111111", "symbol": "SOL", "decimals": 9, "chainSlug": "solana", "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png", "name": "SOL" }, "toToken": { "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "symbol": "USDC", "decimals": 6, "chainSlug": "solana", "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png", "name": "USDC" }, "fromChain": "solana", "toChain": "solana", "distribution": { "Lifinity V2": 100 }, "integration": "jupiter", "amount": "10000000" }] }]
  // )
  // console.log(txData)
}