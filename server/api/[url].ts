import { JSDOM } from "jsdom";

export default defineEventHandler(async (event) => {
  let ans: string[] = [];

  let url = decodeURIComponent(getRouterParam(event, "url") as string);

  var requestOptions = {
    method: "GET",
    // 超时
    timeout: 10000,
  };
  var res = await fetch(url, requestOptions);
  var html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  url = url.split("?")[0].split("#")[0];

  // 如果 currentURL 的结尾是斜杠，就删除结尾的斜杠
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  // 获取所有带有 href 属性的元素
  var elementsWithHref = document.querySelectorAll("[href]");

  // 遍历元素列表并输出完整的跳转路径
  elementsWithHref.forEach(function (element) {
    // 获取 href 属性的值
    var hrefValue = element.getAttribute("href");
    if (hrefValue === null) {
      return [];
    }
    // 如果 href 是相对路径，则组合成完整的跳转路径
    if (hrefValue.startsWith("//")) {
      // 如果 href 是以双斜杠开头，则根据当前页面协议添加协议头
      var fullHref = url.split(":")[0] + ":" + hrefValue;
      console.log(fullHref);
      ans.push(fullHref);
    } else if (hrefValue.startsWith("/")) {
      var fullHref = url + hrefValue;
      console.log(fullHref);
      ans.push(fullHref);
    } else {
      // 如果 href 是绝对路径，则直接输出
      ans.push(hrefValue);
      console.log(hrefValue);
    }
  });

  const urlRegex = /(https?:\/\/\S+)/g;
  const matches = url.match(urlRegex);

  // 附加匹配的 URL
  if (matches) {
    ans.push(...matches);
  }

  // 过滤掉javascript
  ans = ans
    .filter((item) => {
      return !item.startsWith("javascript");
    })
    .map((item) => {
      return item.split("?")[0].replaceAll(/;/g, "");
    })
    // 去重
    .filter((item, index, self) => {
      return self.indexOf(item) === index;
    });

  // // 使用正则表达式匹配所有 http 或 https 的 URL
  // const urlRegex = /(https?:\/\/\S+)/g;
  // const matches = html.match(urlRegex);

  // 输出匹配的 URL
  // if (matches) {
  //   return matches;
  // } else {
  //   return [];
  // }
  return ans;
});

// // 1.导入模块 ES/CJS
// import xCrawl from "x-crawl";

// export default defineEventHandler(async (event) => {
//   // const ans: string[] = [];

//   let url = decodeURIComponent(getRouterParam(event, "url") as string);

//   // 2.创建一个爬虫实例
//   const myXCrawl = xCrawl({
//     maxRetry: 3,
//     timeout: 10000,
//     intervalTime: { max: 3000, min: 2000 },
//   });

//   // 3.设置爬取任务
//   // 调用 startPolling API 开始轮询功能，每隔一天会调用回调函数
//   // myXCrawl.startPolling({ m: 1 }, async (count, stopPolling) => {
//   // 调用 crawlPage API 爬取 首页、国漫、电影 这三个页面
//   const res = await myXCrawl.crawlPage({
//     targets: [url],
//     viewport: { width: 1920, height: 1080 },
//   });

//   // 存放图片 URL 到 targets
//   const targets = [];
//   for (const item of res) {
//     const { id } = item;
//     const { page } = item.data;
//     // 获取页面轮播图片元素的 URL
//     const urls = await page.$$eval(`[href]`, (els: any) =>
//       els.map((item: any) => item.href)
//     );
//     targets.push(...urls);
//     // 关闭页面
//     page.close();
//   }

//   // 返回 targets
//   return targets;
//   // });
// });
