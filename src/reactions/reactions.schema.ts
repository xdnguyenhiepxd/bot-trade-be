import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { ETypeReaction } from "@/reactions/dto/create-reaction.dto"

export type ReactionsDocument = HydratedDocument<Reactions>

@Schema()
export class Reactions {
  @Prop({ required: true })
  ownerId: string

  @Prop({ required: true, enum: ETypeReaction, default: ETypeReaction.LIKE })
  type: string

  @Prop({ required: true })
  bookId: string

  @Prop({ default: Date.now() })
  createdAt: Date

  @Prop({ default: Date.now() })
  updatedAt: Date
}

export const ReactionsSchema = SchemaFactory.createForClass(Reactions)
