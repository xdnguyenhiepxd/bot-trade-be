import { Injectable } from "@nestjs/common"
import { Wallet } from "@project-serum/anchor"
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js"
import * as bs58 from "bs58"
import fetch from "cross-fetch"
import { CreateBlockchainDto } from "./dto/create-blockchain.dto"
import { UpdateBlockchainDto } from "./dto/update-blockchain.dto"

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
    const amount = this.solToLamports(0.005)
    // flowQuoteAndSwap({
    //   amount,
    //   outputMint: "8NH3AfwkizHmbVd83SSxc2YbsFmFL4m2BeepvL6upump",
    // })
  }
}
