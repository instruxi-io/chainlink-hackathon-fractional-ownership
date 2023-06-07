// make HTTP request
const url = `https://fractional-reserve-sxt-worker-production.austin6645.workers.dev/?tokenId=${args[0]}`;
console.log(`HTTP GET Request to ${url}`)

// construct the HTTP Request object. See: https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code
const reserveRequest = Functions.makeHttpRequest({
  url: url,
})

// Execute the API request (Promise)
const reserveResponse = await reserveRequest
if (reserveResponse.error) {
  console.error(reserveResponse.error)
  throw Error("Request failed")
}

const data = reserveResponse["data"]
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

const result = {
  totalReserve: data[0]["TOTAL_RESERVE"],
  tokenId: data[0]['TOKEN_ID']
}
console.log(result)
const buffer1 = Buffer.alloc(32, 0);
buffer1.writeUInt32BE(result.totalReserve, 28);
const buffer2 = Buffer.alloc(32, 0);
buffer2.writeUInt32BE(result.tokenId, 28);

const buffer = Buffer.concat([buffer1, buffer2]);

console.log('0x' + buffer.toString('hex'));
return buffer;
