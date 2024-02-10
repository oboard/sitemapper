// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({ maxRetry: 3, intervalTime: { max: 3000, min: 2000 } })

// 3.设置爬取任务
// 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
myXCrawl.startPolling({ d: 1 }, async (count, stopPolling) => {
  // 调用 crawlPage API 爬取 首页、国漫、电影 这三个页面
  const res = await myXCrawl.crawlPage([
    'https://www.bilibili.com',
    'https://www.bilibili.com/guochuang',
    'https://www.bilibili.com/movie'
  ])

  // 存放图片 URL 到 targets
  const targets = []
  const elSelectorMap = ['.carousel-inner', '.chief-recom-item', '.bg-item']
  for (const item of res) {
    const { id } = item
    const { page } = item.data

    // 获取页面轮播图片元素的 URL
    const urls = await page.$$eval(`${elSelectorMap[id - 1]} img`, (imgEls) =>
      imgEls.map((item) => item.src)
    )
    targets.push(...urls)

    console.log('gbym')
    // 关闭页面
    page.close()
  }
console.log(targets)
  // 调用 crawlFile API 爬取图片
  await myXCrawl.crawlFile({ targets, storeDir: './upload' })
})
