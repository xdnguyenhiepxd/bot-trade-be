import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
export class CreateCategoryDto {
  @ApiProperty({ required: false })
  name: string

  @ApiPropertyOptional()
  description: string

  @ApiPropertyOptional()
  image: string
}
