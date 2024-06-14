import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BlockchainModule } from "./blockchain/blockchain.module"
import environments from "@/helpers/environments";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "@/user/user.module";
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "@/redis/redis.module";

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
    RedisModule,
  ],
})
export class AppModule {}
