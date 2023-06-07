const fs = require("fs")

// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config()

const Location = {
  Inline: 0,
  Remote: 1,
}

const CodeLanguage = {
  JavaScript: 0,
}

const ReturnType = {
  uint: "uint256",
  uint256: "uint256",
  int: "int256",
  int256: "int256",
  string: "string",
  bytes: "Buffer",
  Buffer: "Buffer",
}

// Configure the request by setting the fields below
const requestConfig = {
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // String containing the source code to be executed
  //source: fs.readFileSync("./calculation-example.js").toString(),
  // source: fs.readFileSync('./API-request-example.js').toString(),
  source: fs.readFileSync('./SxTRequests.js').toString(),

  // Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  //secrets: { apiKey: process.env.COINMARKETCAP_API_KEY ?? "" },
  // Per-node secrets objects assigned to each DON member. When using per-node secrets, nodes can only use secrets which they have been assigned.
  perNodeSecrets: [],
  // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
  walletPrivateKey: process.env["PRIVATE_KEY"],
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  //args: ["1", "bitcoin", "btc-bitcoin", "btc", "1000000", "450"],
  //args:["ETH"],
  args:["eyJ0eXBlIjoiYWNjZXNzIiwia2lkIjoiZTUxNDVkYmQtZGNmYi00ZjI4LTg3NzItZjVmNjNlMzcwM2JlIiwiYWxnIjoiRVMyNTYifQ.eyJpYXQiOjE2ODQ3NzcxMjIsIm5iZiI6MTY4NDc3NzEyMiwiZXhwIjoxNjg0Nzc4NjIyLCJ0eXBlIjoiYWNjZXNzIiwidXNlciI6IlBhdHJpY2lvTSIsInN1YnNjcmlwdGlvbiI6IjkyN2RhYTRiLWE2MDItNGIzNS1hYmM3LWYxNGMzNzUyMjEwZSIsInNlc3Npb24iOiIyMDc2MTkxNjNmNDg5YTZkMDViZjc3MWIiLCJzc25fZXhwIjoxNjg0ODYzNTIyNDA1LCJpdGVyYXRpb24iOiI1M2EyZTZhNTM2MGU5OGRjZWVhNDg4MGYifQ.420gx-gbAOjzKSdtyMKaZHC3voIFToXuwgX0ToDSuMSKnJAUnwy1rVaGXODB8_5sb_ZRidh48D9qr2Dx_tlbyg"],
  // Expected type of the returned value
  expectedReturnType: ReturnType.uint256,
  // Redundant URLs which point to encrypted off-chain secrets
  secretsURLs: [],
}

module.exports = requestConfig
