import { dlnCreateOrder } from "../../src"

export async function deBridgeTest() {
  const srcChain = 'ETHEREUM'
  const srcAddr = '0x8341f191d82d6033f5e9ff90f18988e185189498'
  const srcToken = 'ETH'
  const dstChain = 'SOLANA'
  const dstAddr = 'CViufv71DbGMmCKsMLBNunNJfuyQhYWgUA9xfrwazP5i'
  const dstToken = 'SOL'
  const result = await dlnCreateOrder(srcChain, srcAddr, srcToken, "1000000000000000", dstChain, dstAddr, dstToken)
  console.log(JSON.stringify(result, null, 2))
}
