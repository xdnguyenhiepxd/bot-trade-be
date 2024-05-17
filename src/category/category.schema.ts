import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
  @Prop({ required: true })
  name: string

  @Prop({ default: () => "Category" + Date.now() })
  description: string

  @Prop()
  image: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: Date.now() })
  createdAt: Date

  @Prop({ default: Date.now() })
  updatedAt: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)
