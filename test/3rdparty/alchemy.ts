import { alchemyGetAccountPortfolio, alchemyGetTokenMeta, alchemyGetTokenPrice } from "../../src/3rdparty";

export async function alchemyTest() {
  // alchemyGetTokenMeta('ETHEREUM', '0x027198c24cf9b973c9713c8b8be849a0f02471b4')
  // const portfolio = await alchemyGetAccountPortfolio('ETHEREUM', "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
  // console.table(portfolio)
  const ethPrice = await alchemyGetTokenPrice('ETHEREUM', 'AVAX')
  console.log('Price of AVAX =', ethPrice)
}