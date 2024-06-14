import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject } from "@nestjs/common"
import { Cache } from "cache-manager"
import * as process from "process"

// @Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key)
  }

  async set(key: string, value: any, time?: any) {
    if (value === undefined || value === null) return
    await this.cache.set(key, value, time || process.env.REDIS_TTL || 86400)
  }

  async reset() {
    await this.cache.reset()
  }

  async del(key: string) {
    await this.cache.del(key)
  }
}
