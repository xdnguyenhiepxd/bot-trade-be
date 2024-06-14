// import { RedisService } from "@/redis/redis.service"
import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as TelegramBot from "node-telegram-bot-api"
import { ParseMode } from "node-telegram-bot-api"
import * as path from "path"

export type Menu = {
  text: string
  callback_data: string
  url?: string
}

export type PhotoMenu = {
  parse_mode?: ParseMode | undefined
  disable_web_page_preview?: boolean
  reply_markup: { inline_keyboard: Menu[][] }
  caption: string
}

export const createMenuLabel = (label: string): Menu => ({
  text: label,
  callback_data: "none",
})

export const createMenuButton = (button: string, cmd = "none", url?: string): Menu => ({
  text: button,
  callback_data: cmd,
  url: url,
})

export const buildPhotoOptions = (tableButtons: Menu[][], text: string): PhotoMenu => {
  const inlineKeyboardMarkup = { inline_keyboard: tableButtons }
  return {
    reply_markup: { ...inlineKeyboardMarkup },
    parse_mode: "HTML",
    disable_web_page_preview: true,
    caption: text,
  }
}

@Injectable()
export class TelegramService {
  user = new Map()
  bot: TelegramBot
  // constructor(private readonly redisService: RedisService) {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
    this.bot.on("polling_error", console.log)
  }

  async sendPagePhoto(chatId: number, caption: string) {
    const imageFilePath = path.join(__dirname, "/images/eve-fi.png")
    const photo = fs.createReadStream(imageFilePath)
    const menu = buildPhotoOptions(
      [
        [createMenuLabel('Chào bạn, mình là "Eve Father" 🙋‍♀️')],
        [createMenuButton("🤖 My Eve", "/myeve"), createMenuButton("➕ New Eve", "/neweve")],
        [createMenuButton("Reset", "/reset")],
        [createMenuButton("🤙 Support", undefined, "https://t.me/VerifyEveAICommunity")],
      ],
      caption
    )
    const data = await this.bot.sendPhoto(chatId, photo, menu)
    console.log("data", data) // console by M-MON
    this.user.set(chatId, {
      ...this.user.get(chatId),
      message_id: data.message_id,
    })
  }

  async handleStartCommand(msg) {
    const chatId = msg.chat.id
    this.user.set(chatId, {})
    await this.sendPagePhoto(chatId, undefined)
  }

  async handleMessage(msg) {
    // await this.bot.sendMessage(msg.chat.id, 'Hello bạn ơi!', {
    //   message_thread_id: msg.message_thread_id,
    //   parse_mode: 'Markdown',
    //   disable_web_page_preview: true,
    // });
  }

  async handleCallbackQuery(callbackQuery) {
    const message = callbackQuery.message
    const chatId = message.chat.id
    const state = this.user.get(chatId)
    const data = callbackQuery.data // This is the callback_data you set in your button
    switch (data) {
      case "/reset":
        await this.handleResetCommand(chatId, state)
        break
      case "/neweve":
        // Handle '/neweve' command
        break
      // Add more cases as your needs
    }
  }

  async handleResetCommand(chatId: string, state: any = {}) {
    const menu = buildPhotoOptions(
      [[createMenuLabel('Chào bạn, mình là "Eve Father" 🙋‍♀️')], [createMenuButton("Reset", "/reset")]],
      "Reset thành công!"
    )

    if (state?.message_id) {
      await this.bot.editMessageCaption("Reset thành công!", {
        chat_id: chatId,
        message_id: state?.message_id,
        reply_markup: menu?.reply_markup,
      })
    } else {
      console.log("[handleResetCommand]", state) // console by M-MON
    }
  }

  async onApplicationBootstrap() {
    console.log("[onApplicationBootstrap] [TelegramService is ready!]") // console by M-MON
    this.bot.onText(/^\/start$/, async (msg, match) => {
      await this.handleStartCommand(msg)
    })
    this.bot.on("message", async (msg) => {
      console.log("msg", msg); // console by M-MON
      if (msg.text === "/start") return
      await this.handleMessage(msg)
    })

    this.bot.on("callback_query", async (callbackQuery) => {
      await this.handleCallbackQuery(callbackQuery)
    })
  }
}
