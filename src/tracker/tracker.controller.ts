import { JwtGuard } from "@/user/guards/jwt.guard"
import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { TrackerService } from "./book.service"

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
}
