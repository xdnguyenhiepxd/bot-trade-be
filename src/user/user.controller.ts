import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger"
import { imageParseFilePipeBuilder } from "src/helpers/image.parser"
import { JwtGuard } from "./guards/jwt.guard"
import { Login, Register } from "./user.dto"
import { UserService } from "./user.service"

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  register(@Body() dto: Register) {
    return this.userService.register(dto)
  }

  @Post("login")
  async login(@Body() dto: Login) {
    const { email, password } = dto
    if (!email) throw new BadRequestException("Missing email")
    if (!password) throw new BadRequestException("Missing password")
    const user = await this.userService.login(dto)
    return user
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @Patch("update-avatar")
  async changeAvatar(
    @UploadedFile(imageParseFilePipeBuilder)
    file: any
  ) {
    const user = await this.userService.updateAvatar(file)
    return user
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("test-auth")
  async testAuth() {}
}
