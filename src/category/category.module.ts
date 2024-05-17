import databases from "@/database/database.map"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoryController } from "./category.controller"
import { CategoryService } from "./category.service"

@Module({
  imports: [MongooseModule.forFeature(databases)],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
