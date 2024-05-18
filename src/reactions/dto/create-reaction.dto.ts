import { ApiProperty } from "@nestjs/swagger"

export const ETypeReaction = {
  LIKE: "like",
  DISLIKE: "dislike",
}

export class CreateReactionDto {
  @ApiProperty({ required: true, description: "Type of reaction", enum: ETypeReaction, default: ETypeReaction.LIKE })
  type: string

  @ApiProperty({ required: true, description: "Book ID" })
  bookId: string
}
