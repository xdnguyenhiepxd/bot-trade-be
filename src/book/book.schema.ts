import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type BookDocument = HydratedDocument<Book>

@Schema()
export class Book {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  uri: string

  @Prop({ default: "http://www.gravatar.com/avatar/?d=identicon" })
  thumbnail: string
}

export const BookSchema = SchemaFactory.createForClass(Book)
