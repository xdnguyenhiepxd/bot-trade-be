import { Book, BookDocument } from "@/book/book.schema"
import { Category, CategoryDocument } from "@/category/category.schema"
import { ETypeTime, GetReadTimeDto } from "@/read-time/dto/read-time.dto"
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

  async findAll(query: GetReadTimeDto) {
    const typeTime = query?.type || ETypeTime.DAY

    // Define the date aggregation based on the typeTime
    let dateAggregation
    switch (typeTime) {
      case ETypeTime.DAY:
        dateAggregation = { $hour: "$createdAt" }
        break
      case ETypeTime.WEEK:
        dateAggregation = { $dayOfWeek: "$createdAt" }
        break
      case ETypeTime.MONTH:
        dateAggregation = { $dayOfMonth: "$createdAt" }
        break
      case ETypeTime.YEAR:
        dateAggregation = { $month: "$createdAt" }
        break
      default:
        throw new BadRequestException("Invalid typeTime")
    }

    // Use aggregation to group by createdAt and count the documents
    const readTimeStats = await this.readTimeModel.aggregate([
      {
        $group: {
          _id: dateAggregation,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ])

    // Initialize an array to hold the results
    let result
    if (typeTime === ETypeTime.DAY) {
      result = new Array(24).fill(0).map((_, index) => ({
        time: `${index}h`,
        value: 0,
      }))
    } else if (typeTime === ETypeTime.WEEK) {
      result = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
        time: day,
        value: 0,
      }))
    } else if (typeTime === ETypeTime.MONTH) {
      // Get the number of days in the current month
      const now = new Date()
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      result = new Array(daysInMonth).fill(0).map((_, index) => ({
        time: `${index + 1}`,
        value: 0,
      }))
    } else if (typeTime === ETypeTime.YEAR) {
      result = new Array(12).fill(0).map((_, index) => ({
        time: `${index + 1}`,
        value: 0,
      }))
    }

    // Update the count for each time unit
    for (const stat of readTimeStats) {
      if (typeTime === ETypeTime.DAY) {
        result[stat._id].value = stat.count
      } else if (typeTime === ETypeTime.WEEK) {
        const dayIndex = (stat._id + 5) % 7 // This will convert 1 (Sunday) to 0 (Monday), 2 (Monday) to 1 (Tuesday), etc.
        result[dayIndex].value = stat.count
      } else if (typeTime === ETypeTime.MONTH) {
        result[stat._id - 1].value = stat.count // Subtract 1 because array indices start at 0
      } else if (typeTime === ETypeTime.YEAR) {
        result[stat._id - 1].value = stat.count // Subtract 1 because array indices start at 0
      }
    }

    return result
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
