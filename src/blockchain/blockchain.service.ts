import { QuoteGetRequest, QuoteResponse } from "@/blockchain/jupiter-quote-api-node/generated";
import { Injectable } from "@nestjs/common"
import { Wallet } from "@project-serum/anchor"
import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  Keypair,
  TransactionExpiredBlockheightExceededError,
  VersionedTransaction,
  VersionedTransactionResponse,
} from "@solana/web3.js"
import * as bs58 from "bs58"
import fetch from "cross-fetch"
import promiseRetry from "promise-retry"
import { CreateBlockchainDto } from "./dto/create-blockchain.dto"
import { UpdateBlockchainDto } from "./dto/update-blockchain.dto"
import { createJupiterApiClient } from "@/blockchain/jupiter-quote-api-node";
import { flowQuoteAndSwap } from "@/blockchain/jupiter-quote-api-node/common";
export const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection
  serializedTransaction: Buffer
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight
}

const SEND_OPTIONS = {
  skipPreflight: true,
}

// Make sure that you are using your own RPC endpoint.
const connection = new Connection(
  "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"
)
const jupiterQuoteApi = createJupiterApiClient()

async function getQuote() {
  const params: QuoteGetRequest = {
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // $WIF
    amount: 100000000, // 0.1 SOL
    autoSlippage: true,
    autoSlippageCollisionUsdValue: 1_000,
    maxAutoSlippageBps: 1000, // 10%
    minimizeSlippage: true,
    onlyDirectRoutes: false,
    asLegacyTransaction: false,
  }

  // get quote
  const quote = await jupiterQuoteApi.quoteGet(params)

  if (!quote) {
    throw new Error("unable to quote")
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

@Injectable()
export class BlockchainService {
  create(createBlockchainDto: CreateBlockchainDto) {
    return "This action adds a new blockchain"
  }

  findAll() {
    return `This action returns all blockchain`
  }

  findOne(id: number) {
    return `This action returns a #${id} blockchain`
  }

  update(id: number, updateBlockchainDto: UpdateBlockchainDto) {
    return `This action updates a #${id} blockchain`
  }

  remove(id: number) {
    return `This action removes a #${id} blockchain`
  }

  async swap({
    inputMint = "So11111111111111111111111111111111111111112",
    outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount = 100000000,
    slippageBps = 50,
  }) {
    try {
      const connection = new Connection(
        "https://ancient-green-rain.solana-mainnet.quiknode.pro/7957e02b9c1c9047cc86f8d34d2230bd902575e4"
      )
      const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_WALLET_KEY || "")))

      // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
      const data = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
      )
      const quoteResponse = await data.json()
      console.log("==>", 1)

      // get serialized transactions for the swap
      const { swapTransaction } = await (
        await fetch("https://quote-api.jup.ag/v6/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // quoteResponse from /quote api
            quoteResponse,
            // user public key to be used for the swap
            userPublicKey: wallet.publicKey.toString(),
            // auto wrap and unwrap SOL. default is true
            wrapAndUnwrapSol: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
          }),
        })
      ).json()

      // deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      // sign the transaction
      transaction.sign([wallet.payer])

      // Execute the transaction
      const rawTransaction = transaction.serialize()
      console.log("==>", 3)
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      })

      try {
        const data = await connection.confirmTransaction(txid)
        console.log("data", data) // console by M-MON
      } catch (e) {
        if (e.timeout) {
          // If the transaction confirmation timed out, check the status manually
          const statuses = await connection.getSignatureStatuses([txid])
          const status = statuses && statuses.value && statuses.value[0]
          if (status && status.confirmations === null) {
            console.log(`Transaction ${txid} has been confirmed`)
          } else {
            console.log(`Transaction ${txid} has not been confirmed yet`)
          }
        } else {
          throw e
        }
      }
      console.log("==>", 4)
      await connection.confirmTransaction(txid)
      console.log(`https://solscan.io/tx/${txid}`)
    } catch (e) {
      console.log("[BlockchainService] [SWAP] [ERROR] ", e) // console by M-MON
    }
  }

  solToLamports(sol: number): number {
    return sol * 1e9
  }

  async onApplicationBootstrap() {
    console.log("[onApplicationBootstrap] [BlockchainService] The application is starting...")
    const amount = this.solToLamports(0.01)
    flowQuoteAndSwap({
      amount,
      outputMint: "8NH3AfwkizHmbVd83SSxc2YbsFmFL4m2BeepvL6upump",
    })
  }
}
