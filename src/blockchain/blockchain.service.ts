import { Injectable } from "@nestjs/common"
import { Wallet } from "@project-serum/anchor"
import { Connection, Keypair } from "@solana/web3.js"
import bs58 from "bs58"
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

  async swap() {
    const connection = new Connection("")
    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || "")))
  }
  async onApplicationBootstrap() {
    console.log("[onApplicationBootstrap] [BlockchainService] The application is starting...")
  }
}
