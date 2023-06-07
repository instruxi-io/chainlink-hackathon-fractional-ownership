
process.env.COINMARKETCAP_KEY = "f83f6298-c96a-479c-96a7-4ebf3fa869e6"
// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const coinMarketCapCoinId = args[0]
const coinGeckoCoinId = args[1]
const coinPaprikaCoinId = args[2]
const badApiCoinId = args[3]

if (
  process.env.COINMARKETCAP_KEY=="" ||
  process.env.COINMARKETCAP_KEY === "Your coinmarketcap API key (get a free one: https://coinmarketcap.com/api/)"
) {
  throw Error(
    "COINMARKETCAP_API_KEY environment variable not set for CoinMarketCap API.  Get a free key from https://coinmarketcap.com/api/"
  )
}

// To make an HTTP request, use the Functions.makeHttpRequest function
// Functions.makeHttpRequest function parameters:
// - url
// - method (optional, defaults to 'GET')
// - headers: headers supplied as an object (optional)
// - params: URL query parameters supplied as an object (optional)
// - data: request body supplied as an object (optional)
// - timeout: maximum request duration in ms (optional, defaults to 10000ms)
// - responseType: expected response type (optional, defaults to 'json')

// Use multiple APIs & aggregate the results to enhance decentralization
const coinMarketCapRequest = Functions.makeHttpRequest({
  url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&symbol=${coinMarketCapCoinId}`,
  // Get a free API key from https://coinmarketcap.com/api/
  headers: { "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_KEY },
})

// This dummy request simulates a failed API request
const badApiRequest = Functions.makeHttpRequest({
  url: `https://badapi.com/price/symbol/${badApiCoinId}`,
})

// First, execute all the API requests are executed concurrently, then wait for the responses
const [coinMarketCapResponse, badApiResponse] = await Promise.all([
  coinMarketCapRequest,
  badApiRequest,
])

const prices = []

if (!coinMarketCapResponse.error) {
    console.log(coinMarketCapResponse.data.data[coinMarketCapCoinId])
  prices.push(coinMarketCapResponse.data.data[coinMarketCapCoinId].quote.USD.price)
} else {
  console.log("CoinMarketCap Error")
  console.log(coinMarketCapResponse)
}
// A single failed API request does not cause the whole request to fail
if (!badApiResponse.error) {
  prices.push(httpResponses[3].data.price.usd)
} else {
  console.log(
    "Bad API request failed. (This message is expected to demonstrate using console.log for debugging locally with the simulator)"
  )
}

// At least 3 out of 4 prices are needed to aggregate the median price
if (prices.length < 0) {
  // If an error is thrown, it will be returned back to the smart contract
  throw Error("More than 1 API failed")
}

const medianPrice = Math.round(prices[0])
console.log(`Median Ethereum price: $${medianPrice}`)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeUint256(Math.round(medianPrice * 100))