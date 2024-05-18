import databases from "@/database/database.map"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReactionsController } from "./reactions.controller"
import { ReactionsService } from "./reactions.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
