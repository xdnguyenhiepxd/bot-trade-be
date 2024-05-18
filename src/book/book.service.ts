import { CreateBookDto, GetBookDto } from "@/book/book.dto"
import { Category, CategoryDocument } from "@/category/category.schema"
import { ESortType } from "@/dtos/paginate.dto"
import { Reactions, ReactionsDocument } from "@/reactions/reactions.schema"
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
    @InjectModel(Reactions.name) private reactionModel: Model<ReactionsDocument>,
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

  async list(query: GetBookDto) {
    const { take = 20, page = 1, categoryId, search = "", sort_type } = query

    let queryBuilder = this.bookModel.find()

    if (categoryId) {
      queryBuilder = queryBuilder.where("categoryId", categoryId)
    }

    if (search) {
      queryBuilder = queryBuilder.where("name", new RegExp(search, "i"))
    }

    queryBuilder = queryBuilder
      .sort({ createdAt: sort_type === ESortType.ASC ? -1 : 1 })
      .skip((page - 1) * take)
      .limit(take)

    const data = await queryBuilder.exec()
    const count = await this.bookModel.count(queryBuilder)

    return {
      data,
      count,
    }
  }

  async get(_id: string) {
    const book = await this.bookModel.findOne({ _id })
    const reaction = await this.reactionModel.findOne({ ownerId: this.request.user._id, bookId: _id })
    const isLiked = !!reaction
    return {
      ...book.toObject(),
      isLiked,
    }
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
