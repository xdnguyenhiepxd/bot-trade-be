import { ImageGateway } from "@/services/image.gateway.service";
import { JwtStrategy } from "@/user/guards/jwt.strategy";
import { User, UserSchema } from "@/user/user.schema";
import { UserService } from "@/user/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookController } from "./book.controller";
import { Book, BookSchema } from "./book.schema";
import { BookService } from "./book.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
	],
	controllers: [BookController],
	providers: [UserService, BookService, JwtStrategy, ImageGateway],
	exports: [UserService, BookService, ImageGateway],
})
export class BookModule {}
