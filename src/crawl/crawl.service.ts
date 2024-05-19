import { Crawl, CrawlDocument } from "@/crawl/crawl.schema"
import { TypeCrawl } from "@/crawl/dto/crawl.dto"
import { randomUserAgent } from "@/helpers/helper"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import * as cheerio from "cheerio"
import { Model } from "mongoose"
import puppeteer from "puppeteer"
import { CreateCrawlDto } from "./dto/create-crawl.dto"
import { UpdateCrawlDto } from "./dto/update-crawl.dto"

@Injectable()
export class CrawlService {
  constructor(@InjectModel(Crawl.name) private crawlModel: Model<CrawlDocument>) {}

  async crawlWebApp(
    url: string,
    type: "html" | "txt" = "html",
    typeCrawl: TypeCrawl = TypeCrawl.CATEGORY
  ): Promise<any> {
    const array = []
    let category = ""

    const browser = await puppeteer.launch({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headless: "new", // Use the headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-features=site-per-process",
      ],
    })
    console.log("🚀 ~ CrawlService ~ browser:", browser)
    try {
      const page: any = await browser.newPage()
      page.on("framenavigated", (frame) => {
        console.log("Frame navigated: " + frame.name())
      })

      page.on("framedetached", (frame) => {
        console.log("Frame detached: " + frame.name())
      })
      page.setDefaultNavigationTimeout(60)
      await page.setUserAgent(randomUserAgent(false))
      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" })
      // await page.waitForTimeout(1000)

      let htmlContent = ""
      if (type === "txt") {
        // await page.waitForSelector('.example-class');
        const pageContent = await page.evaluate(() => {
          return document.body.innerText
        })
        return pageContent
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // const myVariableValue = await page.evaluate(() => window?.reader)

        htmlContent = await page.content()
        // fs.writeFile(`${new Date().getTime()}.html`, htmlContent, (err) => {
        //   if (err) {
        //     console.error("Error writing file:", err)
        //   } else {
        //     console.log("File written successfully")
        //   }
        // })
        const $ = cheerio.load(htmlContent)

        const scripts = $("script")
        let epubUrl = ""

        scripts.each((index, element) => {
          const content = $(element).html()
          const match = content.match(/ePubReader\("(.+?\.epub)"/)
          if (match) {
            epubUrl = match[1]
          }
        })

        if (typeCrawl === TypeCrawl.DOC) {
          await browser.close()
          return "https://www.dtv-ebook.com/" + epubUrl
        }
        const contentElements = $(".hide-for-small-only")
        const categoryElements = $(".tieu_de")
        const linkBook = $(".button.alert.radius.tiny ").attr("href")
        if (typeCrawl === TypeCrawl.DETAIL) {
          await browser.close()
          return {
            linkBook: linkBook,
          }
        }
        category = $(categoryElements).html()
        // Kiểm tra xem phần tử có tồn tại không
        if (contentElements.length > 0) {
          contentElements.each((index, element) => {
            const htmlContent = $(element).html()
            const hrefValue = $(element).find("a").attr("href")
            const title = $(element).find("a").attr("title")
            const hrefImg = $(element).find("img").attr("src")
            // const textContent = htmlToText(htmlContent);
            array.push({
              crawlURL: url,
              urlDetail: hrefValue,
              name: title,
              thumbnail: hrefImg,
              category: category.replaceAll("<!--tieu de-->", "").replaceAll("\\n    ", "").trim(),
            })
          })
        } else {
          console.log("Không tìm thấy phần tử với class đã chỉ định.")
        }
      }
      await browser.close()
      return array
    } catch (error) {
      console.error("[ERROR crawlWebApp]:", error)
    } finally {
      await browser.close()
    }
    return []
  }
  async getUrlCategory(url: string, type: "html" | "txt" = "html", typeCrawl: TypeCrawl): Promise<any> {
    const array = await this.crawlWebApp(url, type, typeCrawl)
    return array
  }

  async deleteByCrawlURL(crawlURL: string): Promise<any> {
    return this.crawlModel.deleteMany({ crawlURL: crawlURL }).exec();
  }

  create(createCrawlDto: CreateCrawlDto) {
    return "This action adds a new crawl"
  }

  findAll() {
    return `This action returns all crawl`
  }

  findOne(id: number) {
    return `This action returns a #${id} crawl`
  }

  update(id: number, updateCrawlDto: UpdateCrawlDto) {
    return `This action updates a #${id} crawl`
  }

  remove(id: number) {
    return `This action removes a #${id} crawl`
  }
}
