import { PaginateDto } from "@/dtos/paginate.dto"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateBookDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  categoryId: string

  @ApiPropertyOptional({
    default: "https://filesamples.com/samples/ebook/epub/Around%20the%20World%20in%2028%20Languages.epub",
  })
  uri: string

  @ApiPropertyOptional({
    default: "http://www.gravatar.com/avatar/?d=identicon",
  })
  thumbnail: string
}

export class GetBookDto extends PaginateDto {
  @ApiPropertyOptional()
  categoryId: string

  @ApiPropertyOptional()
  search: string
}
