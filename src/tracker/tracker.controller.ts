import { JwtGuard } from "@/user/guards/jwt.guard"
import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { TrackerDocument } from "./tracker.schema"
import { TrackerService } from "./tracker.service"

@Controller("tracker")
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get(":id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  get(@Param() id: string) {
    return this.trackerService.get(id)
  }

  @Get("list")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  list() {
    return this.trackerService.list()
  }

  @Put("")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(@Body() dto: TrackerDocument) {
    return this.trackerService.update(dto)
  }
}
