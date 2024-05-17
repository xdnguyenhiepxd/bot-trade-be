import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { PassportModule } from "@nestjs/passport"
import { BookModule } from "./book/book.module"
import environments from "./helpers/environments"
import { TrackerModule } from "./tracker/tracker.module"
import { UserModule } from "./user/user.module"
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MongooseModule.forRoot(environments.MONGO_DB_URL, {
      dbName: environments.MONGO_DB,
    }),
    JwtModule.register({
      global: true,
      secret: environments.JWT_SECRET,
      signOptions: { expiresIn: environments.JWT_EXPIRE },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
    BookModule,
    TrackerModule,
    CategoryModule,
  ],
})
export class AppModule {}
