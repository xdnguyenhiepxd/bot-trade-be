import databases from "@/database/database.map"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReadTimeController } from "./read-time.controller"
import { ReadTimeService } from "./read-time.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [ReadTimeController],
  providers: [ReadTimeService],
})
export class ReadTimeModule implements OnApplicationBootstrap {
  constructor() {
    console.log("[ReadTimeModule] constructor")
  }
  async onApplicationBootstrap() {
    console.log("[ReadTimeModule] onApplicationBootstrap")
  }
}
