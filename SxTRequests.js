
// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const jwt_cache = args[0]
const badApiCoinId = args[3]


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
const SxTNamespaceRequest = Functions.makeHttpRequest({
  url: `https://api.spaceandtime.app/v1/discover/namespace`,
  // Get a free API key from https://coinmarketcap.com/api/
  headers: { "accept": "application/json","content-type":"application/json","authorization":'Bearer eyJ0eXBlIjoiYWNjZXNzIiwia2lkIjoiZTUxNDVkYmQtZGNmYi00ZjI4LTg3NzItZjVmNjNlMzcwM2JlIiwiYWxnIjoiRVMyNTYifQ.eyJpYXQiOjE2ODUwMzQxOTYsIm5iZiI6MTY4NTAzNDE5NiwiZXhwIjoxNjg1MDM1Njk2LCJ0eXBlIjoiYWNjZXNzIiwidXNlciI6Imluc3RydXhpLTAwMSIsInN1YnNjcmlwdGlvbiI6IjkyN2RhYTRiLWE2MDItNGIzNS1hYmM3LWYxNGMzNzUyMjEwZSIsInNlc3Npb24iOiJiYzQ1YTlkMTI4N2FhZTEzYjYxMTlhNDEiLCJzc25fZXhwIjoxNjg1MTIwNTk2NzY3LCJpdGVyYXRpb24iOiJmMmY5MDUxZDhlZjdiMzlmMmZkZTljYTkifQ.rzQnhMiB8LM8HEoFIsVdxJBzrLpjZ4ISy46nebTI2lW-d6Kz6tpu5jw-iAJPR8GVU2Ei4ZG0Azr87BKkRpCEhA' },
    cf: {cacheEverything: true}
})

const cloudfareRequest = Functions.makeHttpRequest({
    url: 'https://spaceandtime.patricio.workers.dev/',
    cf: {cacheEverything: true}
})
// This dummy request simulates a failed API request
const badApiRequest = Functions.makeHttpRequest({
  url: `https://badapi.com/price/symbol/${badApiCoinId}`,
})

// First, execute all the API requests are executed concurrently, then wait for the responses
const [cloudfareResponse, badApiResponse] = await Promise.all([
  cloudfareRequest,
  badApiRequest,
])


if (!cloudfareResponse.error) {
    console.log(cloudfareResponse.data)
} else {
  console.log("SxT Error")
  console.log(cloudfareResponse)
}
// A single failed API request does not cause the whole request to fail
if (!badApiResponse.error) {
  prices.push(httpResponses[3].data.price.usd)
} else {
  console.log(
    "Bad API request failed. (This message is expected to demonstrate using console.log for debugging locally with the simulator)"
  )
}



// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeUint256(cloudfareResponse)