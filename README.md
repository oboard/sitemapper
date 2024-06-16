# Sitemapper

Sitemapper is a spider that crawls a website and generates a sitemap for it. It uses href links to discover new pages on the website and adds them to the sitemap.

Sitemapper是一个爬虫，它可以爬取一个网站并生成网站地图。它使用href链接来发现网站上的新页面，并将它们添加到网站地图中。

## Try

[Sitemapper from Vercel](https://sitemapper.vercel.app/)

[Sitemapper from oboard](https://site.oboard.eu.org/)

## Usage

```sh
pnpm install
pnpm dev

bun install
bun dev
```

Input the website URL and click "search". The sitemap will be generated and displayed.

Then you can click "deeper" to generate a chain reaction of sitemaps for all the pages on the website.

输入网站URL并点击“search”。网站地图将生成并显示。

然后，你可以点击“deeper”来为网站上的所有页面生成网站地图链反应。

## License

[MIT](LICENSE)