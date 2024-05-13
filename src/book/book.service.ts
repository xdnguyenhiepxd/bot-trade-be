import { Tracker, TrackerDocument } from "@/tracker/tracker.schema"
import { UserDocument } from "@/user/user.schema"
import { Inject, Injectable } from "@nestjs/common"
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
    private readonly imageKitService: ImageGateway
  ) {}

  async list() {
    return this.bookModel.find()
  }

  async get(id: string) {
    return this.bookModel.findOne({ id })
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
