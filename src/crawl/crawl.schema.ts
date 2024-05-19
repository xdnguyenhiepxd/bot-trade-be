import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type CrawlDocument = HydratedDocument<Crawl>

@Schema()
export class Crawl {
  @Prop({ required: true })
  crawlURL: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  urlDetail: string

  @Prop({})
  uri: string

  @Prop({ default: "http://www.gravatar.com/avatar/?d=identicon" })
  thumbnail: string

  @Prop({})
  category: string
}

export const CrawlSchema = SchemaFactory.createForClass(Crawl)
