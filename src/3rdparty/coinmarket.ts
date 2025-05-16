import axios from "axios"

const coinmarketApi = process.env.COINMARKET_API || ""
const coinmarketUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency"

export async function coinmarketGetTokenAddress(network: string, tokenName: string): Promise<string|undefined> {
  try {
    const resp = await axios.get(`${coinmarketUrl}/map?symbol=${tokenName}`, {
      headers: {
        "X-CMC_PRO_API_KEY": coinmarketApi
      }
    })
  
    const respData = resp.data
    if (respData.status.error_code)
      return undefined
    const dataList = respData.data
    // console.log(dataList)
    const coinData = dataList.find((d: any) => d.is_active == 1 && d.platform.name.toLowerCase() === network.toLowerCase())
    if (!coinData && !coinData.platform)
      return undefined
    return coinData.platform.token_address 
  } catch (error) {
    return undefined
  }
}