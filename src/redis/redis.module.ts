// @ts-ignore
import { CacheModule } from "@nestjs/cache-manager"
import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { redisStore } from "cache-manager-ioredis-yet"
import * as process from "process"
import { RedisService } from "./redis.service"

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT) || 6379,
          db: parseInt(process.env.REDIS_DATABASE) || 0,
        }),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
