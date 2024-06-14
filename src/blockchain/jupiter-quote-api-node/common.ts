import { getSignature } from "@/blockchain/jupiter-quote-api-node/utils/getSignature"
import { transactionSenderAndConfirmationWaiter } from "@/blockchain/jupiter-quote-api-node/utils/transactionSender"
import { Wallet } from "@project-serum/anchor"
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js"
import * as bs58 from "bs58"
import { createJupiterApiClient, QuoteGetRequest, QuoteResponse } from "./index"

// Make sure that you are using your own RPC endpoint.
const connection = new Connection(
  "https://ancient-green-rain.solana-mainnet.quiknode.pro/7957e02b9c1c9047cc86f8d34d2230bd902575e4"
)
const jupiterQuoteApi = createJupiterApiClient()

async function getQuote(_params: QuoteGetRequest) {
  // basic params
  // const params: QuoteGetRequest = {
  //   inputMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
  //   outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
  //   amount: 35281,
  //   slippageBps: 50,
  //   onlyDirectRoutes: false,
  //   asLegacyTransaction: false,
  // }

  // auto slippage w/ minimizeSlippage params
  const params: QuoteGetRequest = {
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // $WIF
    // amount: 100000000, // 0.1 SOL
    amount: 10000000, // 0.01 SOL
    autoSlippage: true,
    autoSlippageCollisionUsdValue: 1_000,
    maxAutoSlippageBps: 1000, // 10%
    minimizeSlippage: true,
    onlyDirectRoutes: false,
    asLegacyTransaction: false,
    ..._params,
  }
  // get quote
  const quote = await jupiterQuoteApi.quoteGet(params)

  if (!quote) {
    console.log("unable to quote")
    return
  }
  return quote
}

async function getSwapObj(wallet: Wallet, quote: QuoteResponse) {
  // Get serialized transaction
  const swapObj = await jupiterQuoteApi.swapPost({
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: "auto",
    },
  })
  return swapObj
}

export async function flowQuoteAndSwap(_params?: QuoteGetRequest) {
  const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_WALLET_KEY || "")))

  console.log("Wallet:", wallet.publicKey.toBase58())

  const quote = await getQuote(_params)

  const swapObj = await getSwapObj(wallet, quote)

  // Serialize the transaction
  const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64")
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

  // Sign the transaction
  transaction.sign([wallet.payer])
  const signature = getSignature(transaction)

  // We first simulate whether the transaction would be successful
  const { value: simulatedTransactionResponse } = await connection.simulateTransaction(transaction, {
    replaceRecentBlockhash: true,
    commitment: "processed",
  })
  const { err, logs } = simulatedTransactionResponse

  if (err) {
    // Simulation error, we can check the logs for more details
    // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
    console.error("Simulation Error:")
    console.error({ err, logs })
    flowQuoteAndSwap(_params)
    return
  }

  const serializedTransaction = Buffer.from(transaction.serialize())
  const blockhash = transaction.message.recentBlockhash

  const transactionResponse = await transactionSenderAndConfirmationWaiter({
    connection,
    serializedTransaction,
    blockhashWithExpiryBlockHeight: {
      blockhash,
      lastValidBlockHeight: swapObj.lastValidBlockHeight,
    },
  })

  // If we are not getting a response back, the transaction has not confirmed.
  if (!transactionResponse) {
    console.error("Transaction not confirmed")
    flowQuoteAndSwap(_params)
    return
  }

  if (transactionResponse.meta?.err) {
    console.error(transactionResponse.meta?.err)
    flowQuoteAndSwap(_params)
  }

  console.log(`https://solscan.io/tx/${signature}`)
  return {
    href: `https://solscan.io/tx/${signature}`,
    txh: signature,
  }

}
