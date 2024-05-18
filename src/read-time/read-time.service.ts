import { Book, BookDocument } from "@/book/book.schema"
import { Category, CategoryDocument } from "@/category/category.schema"
import { ReadTime, ReadTimeDocument } from "@/read-time/read-time.schema"
import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { UserDocument } from "@/user/user.schema"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateReadTimeDto } from "./dto/create-read-time.dto"
import { UpdateReadTimeDto } from "./dto/update-read-time.dto"

@Injectable()
export class ReadTimeService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(ReadTime.name) private readTimeModel: Model<ReadTimeDocument>
  ) {}

  async create(createReadTimeDto: CreateReadTimeDto) {
    if (!createReadTimeDto?.bookId) {
      throw new BadRequestException("BookId is required")
    }
    const book = await this.bookModel.findOne({ _id: createReadTimeDto.bookId })
    if (!book) {
      throw new BadRequestException("Book not found")
    }
    //
    const { user } = this.request
    const userId = user?.id
    const readTimeOld = await this.readTimeModel.findOne({ bookId: createReadTimeDto.bookId }).sort({ createdAt: -1 })
    if (readTimeOld) {
      if (readTimeOld.createdAt) {
        const time = new Date().getTime() - readTimeOld.createdAt.getTime()
        // console.log("new Date().getTime(): ", new Date(readTimeOld.createdAt.getTime()))
        // console.log("new Date().getTime(): ", new Date())
        // console.log("readTimeOld.createdAt.getTime(): ", readTimeOld.createdAt.getTime())
        // console.log("time", time)
        // TODO: time < 60s => false
        if (time < 60000) {
          return false
        }
      }
    }

    const readTime = new this.readTimeModel({
      bookId: createReadTimeDto.bookId,
      ownerId: userId,
    })
    await readTime.save()
    return true
  }

  findAll() {
    return `This action returns all readTime`
  }

  findOne(id: number) {
    return `This action returns a #${id} readTime`
  }

  update(id: number, updateReadTimeDto: UpdateReadTimeDto) {
    return `This action updates a #${id} readTime`
  }

  remove(id: number) {
    return `This action removes a #${id} readTime`
  }
}
