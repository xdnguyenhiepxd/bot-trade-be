import { Controller } from "@nestjs/common"
import { TelegramService } from "./telegram.service"

@Controller("telegram")
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
  //
  // @Post()
  // create(@Body() createTelegramDto: CreateTelegramDto) {
  //   return this.telegramService.create(createTelegramDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.telegramService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.telegramService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTelegramDto: UpdateTelegramDto) {
  //   return this.telegramService.update(+id, updateTelegramDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.telegramService.remove(+id);
  // }
}
