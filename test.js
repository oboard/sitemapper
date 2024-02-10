const inputString = "Visit our website at http://example.com or check out https://www.example.org";

// 使用正则表达式匹配所有 http 或 https 的 URL
const urlRegex = /(https?:\/\/\S+)/g;
const matches = inputString.match(urlRegex);

// 输出匹配的 URL
if (matches) {
    console.log("匹配到的URL：", matches);
} else {
    console.log("未找到匹配的URL。");
}