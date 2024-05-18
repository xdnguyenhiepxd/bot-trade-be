import { CreateBookDto } from "@/book/book.dto"
import { Category, CategoryDocument } from "@/category/category.schema"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ImageGateway } from "src/services/image.gateway.service"
import { Book, BookDocument } from "./book.schema"
@Injectable()
export class BookService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly imageKitService: ImageGateway
  ) {}

  // async onApplicationBootstrap() {
  //   const categories = await this.categoryModel.find()
  //   const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  //   console.log("randomCategory", randomCategory) // console by M-MON
  // }

  async create(books: CreateBookDto) {
    const book = await this.bookModel.findOne({ name: books.name })
    if (book) {
      throw new BadRequestException("Book with this name already exists")
    }

    const category = await this.categoryModel.findOne({ id: books.categoryId })
    if (!category) {
      const categories = await this.categoryModel.find()
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      // throw new BadRequestException("Category not found")
      books.categoryId = randomCategory.id
    }

    const newBook = new this.bookModel({
      ...books,
    })

    await newBook.save()
    return newBook
  }

  async list() {
    return this.bookModel.find()
  }

  async get(_id: string) {
    return this.bookModel.findOne({ _id })
  }

  async upload(name: string, file: any) {
    const { url } = await this.imageKitService.upload(file)
    const book = new this.bookModel({
      name,
      uri: url,
    })
    await book.save()
    return book
  }
}
