import { ApiProperty } from "@nestjs/swagger"

export class CreateReadTimeDto {
  @ApiProperty({ required: true, description: "BookId" })
  bookId: string
}
