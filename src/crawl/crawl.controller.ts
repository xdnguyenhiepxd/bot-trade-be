import { GetCrawlDto } from "@/crawl/dto/crawl.dto"
import { Controller, Delete, Get, Param, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { CrawlService } from "./crawl.service"

@ApiTags("crawl")
@Controller("crawl")
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}

  // @Post()
  // create(@Body() createCrawlDto: CreateCrawlDto) {
  //   return this.crawlService.create(createCrawlDto)
  // }
  //
  // @Get()
  // findAll() {
  //   return this.crawlService.findAll()
  // }

  @Get("category/:url")
  findOne(@Param("url") url: string, @Query() query: GetCrawlDto) {
    const { typeCrawl } = query
    return this.crawlService.getUrlCategory(url, undefined, typeCrawl)
  }

  // @Patch(":id")
  // getUrl(@Param("id") id: string, @Body() updateCrawlDto: UpdateCrawlDto) {
  //   return this.crawlService.update(+id, updateCrawlDto)
  // }

  @Delete(":url_crawl")
  remove(@Param("url_crawl") urlCrawl: string) {
    return this.crawlService.deleteByCrawlURL(urlCrawl)
  }
}
