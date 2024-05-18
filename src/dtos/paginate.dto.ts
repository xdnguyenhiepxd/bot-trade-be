import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, Max, Min } from "class-validator"
import { MAX_PAGINATION_TAKEN, MIN_PAGINATION_TAKEN, PAGINATION_TAKEN } from "./constant"

export enum ESortType {
  ASC = "ASC",
  DESC = "DESC",
}

export class PaginateDto {
  @ApiPropertyOptional({
    name: "take",
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Max(MAX_PAGINATION_TAKEN)
  @Min(MIN_PAGINATION_TAKEN)
  take?: number = PAGINATION_TAKEN

  @ApiPropertyOptional({
    name: "page",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = MIN_PAGINATION_TAKEN

  @ApiPropertyOptional()
  sort_field = "created_at"

  @ApiPropertyOptional({
    type: "enum",
    enum: ESortType,
    default: ESortType.DESC,
  })
  @IsOptional()
  sortType?: ESortType
}
