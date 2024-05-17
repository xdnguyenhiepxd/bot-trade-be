import { Category, CategoryDocument } from "@/category/category.schema"
import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { UpdateCategoryDto } from "./dto/update-category.dto"

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name })
    if (existingCategory) {
      throw new BadRequestException("Category with this name already exists")
    }
    const category = new this.categoryModel(createCategoryDto)
    await category.save()
    return category
  }

  async findAll() {
    return this.categoryModel.find().exec()
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id).exec()
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({ name: updateCategoryDto.name })
    if (category) {
      throw new BadRequestException("Category with this name already exists")
    }
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec()
  }

  async remove(id: string) {
    return this.categoryModel.findByIdAndRemove(id).exec()
  }
}
