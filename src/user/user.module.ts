import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { JwtStrategy } from "./guards/jwt.strategy"
import { UserController } from "./user.controller"
import { User, UserSchema } from "./user.schema"
import { UserService } from "./user.service"

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService, JwtStrategy],
})
export class UserModule {}
