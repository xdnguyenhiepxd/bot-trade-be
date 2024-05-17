import databases from "@/database/database.map"
import { JwtStrategy } from "@/user/guards/jwt.strategy"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TrackerController } from "./tracker.controller"
import { TrackerService } from "./tracker.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [TrackerController],
  providers: [TrackerService, JwtStrategy],
  exports: [TrackerService],
})
export class TrackerModule implements OnApplicationBootstrap {
  constructor() {
    console.log("[TrackerModule] constructor")
  }
  async onApplicationBootstrap() {
    console.log("[TrackerModule] onApplicationBootstrap")
  }
}
