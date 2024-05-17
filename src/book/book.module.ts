import { Book, BookDocument } from "@/book/book.schema"
import { Category, CategoryDocument } from "@/category/category.schema"
import databases from "@/database/database.map"
import { ImageGateway } from "@/services/image.gateway.service"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { JwtStrategy } from "@/user/guards/jwt.strategy"
import { UserService } from "@/user/user.service"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel, MongooseModule } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BookController } from "./book.controller"
import { BookService } from "./book.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [BookController],
  providers: [UserService, BookService, JwtStrategy, ImageGateway],
  exports: [UserService, BookService, ImageGateway],
})
export class BookModule implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}
  async onApplicationBootstrap() {
    console.log("[BookModule] onApplicationBootstrap")
    const categories = await this.categoryModel.find()
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    console.log("randomCategory", randomCategory) // console by M-MON
  }
}
