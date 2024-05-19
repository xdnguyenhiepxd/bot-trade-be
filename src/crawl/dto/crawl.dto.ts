import { ApiPropertyOptional } from "@nestjs/swagger"

export enum TypeCrawl {
  DOC = "doc",
  DETAIL = "detail",
  CATEGORY = "category",
}
export class GetCrawlDto {
  @ApiPropertyOptional({
    enum: TypeCrawl,
    default: TypeCrawl.CATEGORY,
  })
  typeCrawl: TypeCrawl
}
