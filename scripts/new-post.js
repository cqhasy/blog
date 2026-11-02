import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const help = `用法：
  pnpm new-post <文件名>                 # 新建分享
  pnpm new-post shares <文件名>          # 新建分享
  pnpm new-post notes <文件名>           # 新建随笔
  pnpm new-note <文件名>                 # 新建随笔`;
if (!args.length || args.includes("--help")) {
	console.log(help);
	process.exit(args.length ? 0 : 1);
}
const explicitCollection = ["shares", "notes"].includes(args[0]);
const collection = explicitCollection ? args.shift() : "shares";
if (!args.length) {
	console.error(help);
	process.exit(1);
}
const title = args.join(" ");
const fileName = /\.md$/i.test(title) ? title : `${title}.md`;
const targetDir = path.resolve("src/content", collection);
const fullPath = path.resolve(targetDir, fileName);
if (!fullPath.startsWith(`${targetDir}${path.sep}`)) {
	console.error("文件名必须位于所选栏目目录内。");
	process.exit(1);
}
if (fs.existsSync(fullPath)) {
	console.error(`文件已存在：${fullPath}`);
	process.exit(1);
}
fs.mkdirSync(path.dirname(fullPath), { recursive: true });
const published = new Intl.DateTimeFormat("en-CA", {
	timeZone: "Asia/Shanghai",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
}).format(new Date());
const content = `---
title: ${JSON.stringify(title.replace(/\.md$/i, ""))}
published: ${published}
description: ''
tags: []
draft: true
---

`;
fs.writeFileSync(fullPath, content, { flag: "wx" });
console.log(
	`已创建${collection === "shares" ? "分享" : "随笔"}草稿：${fullPath}`,
);
