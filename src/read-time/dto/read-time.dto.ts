import { ApiProperty } from "@nestjs/swagger"

export const ETypeTime = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
}
export class GetReadTimeDto {
  @ApiProperty({ required: true, description: "BookId", enum: ETypeTime })
  type: string
}
