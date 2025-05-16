import { web3BridgeRequest } from "../../src"

export async function bridgeTest() {
  const result = await web3BridgeRequest(
    'ETHEREUM', 
    '0x4b80c27d6E9cd1e397322D11e01ed9AdFF0b6cef', 
    '0x0000000000000000000000000000000000000000',
    'SOLANA',
    '7Sh4Rf2zFoSqkorTBqnhB6utJq1SJ53b4xq1g86Z2UBy',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    0.0001)
  console.log(result)
}
