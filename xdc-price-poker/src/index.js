require("dotenv").config();

const fetch = require("node-fetch");
const Web3 = require("web3");
const express = require("express");
const app = express();

const {
  WALLET_PRIVATE_KEY,
  POKE_TARGET_CONTRACT,
  JSON_RPC_NODE_URL = "https://rpc-apothem.xinfin.yodaplus.net",
  POLL_INTERVAL = 60000,
  PORT = 3000,
} = process.env;

if (!WALLET_PRIVATE_KEY) {
  console.log("WALLET_PRIVATE_KEY is not defined");
  process.exit(1);
}

if (!POKE_TARGET_CONTRACT) {
  console.log("POKE_TARGET_CONTRACT is not defined");
  process.exit(1);
}

const web3 = new Web3(JSON_RPC_NODE_URL);

web3.eth.accounts.wallet.add(WALLET_PRIVATE_KEY);

let status = "IDLE";

app.get("/status", (req, res) => {
  res.send(JSON.stringify({ status }));
});

app.listen(PORT);
console.log("web server started at", PORT);

const run = async () => {
  status = "FETCH";

  const res = await fetch(
    "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=XDC-USDT"
  );

  const resJson = await res.json();

  const price = resJson?.data?.price;

  if (!price) {
    throw new Error("Can't get the price");
  }

  console.log("Received XDC price:", price);

  const priceWei = web3.utils.toWei(price, "ether");
  const priceBytes32 = web3.utils.padLeft(web3.utils.toHex(priceWei), 64);

  const txData = web3.eth.abi.encodeFunctionCall(
    {
      name: "poke",
      type: "function",
      inputs: [
        {
          type: "bytes32",
          name: "wut",
        },
      ],
    },
    [priceBytes32]
  );

  console.log("Sending poke() transaction to", POKE_TARGET_CONTRACT);

  status = "POKE";

  const receipt = await web3.eth.sendTransaction({
    to: POKE_TARGET_CONTRACT,
    from: web3.eth.accounts.wallet[0].address,
    data: txData,
    gas: 332060,
  });

  console.log("Receipt status:", receipt.status);
  console.log("Tx hash:", receipt.transactionHash);
};

const runTry = async () => {
  try {
    await run();
  } catch (e) {
    console.log("Failed:", e);
  }

  status = "SLEEP";

  console.log("Sleeping for", POLL_INTERVAL);

  setTimeout(() => {
    runTry();
  }, POLL_INTERVAL);
};

runTry();
