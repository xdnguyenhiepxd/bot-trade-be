import { Book, BookSchema } from "@/book/book.schema"
import { Category, CategorySchema } from "@/category/category.schema"
import { ReadTime, ReadTimeSchema } from "@/read-time/read-time.schema"
import { Tracker, TrackerSchema } from "@/tracker/tracker.schema"
import { User, UserSchema } from "@/user/user.schema"

const databases = [
  { name: User.name, schema: UserSchema },
  { name: Category.name, schema: CategorySchema },
  { name: Book.name, schema: BookSchema },
  { name: Tracker.name, schema: TrackerSchema },
  { name: ReadTime.name, schema: ReadTimeSchema },
]

export default databases
