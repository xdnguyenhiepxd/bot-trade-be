import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { CreateReadTimeDto } from "./dto/create-read-time.dto"
import { UpdateReadTimeDto } from "./dto/update-read-time.dto"
import { ReadTimeService } from "./read-time.service"
import { JwtGuard } from "@/user/guards/jwt.guard"

@ApiTags("read-time")
@Controller("read-time")
export class ReadTimeController {
  constructor(private readonly readTimeService: ReadTimeService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createReadTimeDto: CreateReadTimeDto) {
    return this.readTimeService.create(createReadTimeDto)
  }

  @Get()
  findAll() {
    return this.readTimeService.findAll()
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.readTimeService.findOne(+id)
  // }
  //
  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateReadTimeDto: UpdateReadTimeDto) {
  //   return this.readTimeService.update(+id, updateReadTimeDto)
  // }
  //
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.readTimeService.remove(+id)
  // }
}
