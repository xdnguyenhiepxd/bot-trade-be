import environments from "@/helpers/environments"
import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import * as bcrypt from "bcrypt"
import { Model } from "mongoose"
import { Login, Register } from "./user.dto"
import { User, UserDocument } from "./user.schema"
@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: UserDocument },
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  signUser(user: UserDocument) {
    const { id, email, name } = user
    const payload = { id, email, name }
    const jwt = this.jwtService.sign(payload, {
      secret: environments.JWT_SECRET,
    })

    return {
      jwt,
      user,
    }
  }

  async register({ email, password }: Register) {
    const user = await this.userModel.findOne({ email })
    if (user) throw new BadRequestException("Tài khoản đã tồn tại")
    const newUser = new this.userModel({
      email,
      name: email.split("@")[0],
      passwordHash: bcrypt.hashSync(password, 10),
    })
    newUser.save()
    return this.signUser(newUser)
  }

  async login({ email, password }: Login) {
    const user = await this.userModel.findOne({ email })
    if (!user) throw new BadRequestException("Tài khoản không tồn tại")
    const isValidPassword = bcrypt.compareSync(password, user.passwordHash)
    if (!isValidPassword) throw new BadRequestException("Mật khẩu chưa đúng")
    return this.signUser(user)
  }

  async updateAvatar(file: any) {
    const user = this.request.user
    return user
  }
}
