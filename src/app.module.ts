import environments from "@/helpers/environments"
import { RedisModule } from "@/redis/redis.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { PassportModule } from "@nestjs/passport"
import { BlockchainModule } from "./blockchain/blockchain.module"
import { TelegramModule } from "./telegram/telegram.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environments.MONGO_DB_URL, {
      dbName: environments.MONGO_DB,
    }),
    JwtModule.register({
      global: true,
      secret: environments.JWT_SECRET,
      signOptions: { expiresIn: environments.JWT_EXPIRE },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    BlockchainModule,
    TelegramModule,
    // RedisModule,
  ],
})
export class AppModule {}
