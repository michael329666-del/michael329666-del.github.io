# Michael Wang Photography

Michael Wang 的 Astro 摄影作品集，已发布到
[GitHub Pages](https://michael329666-del.github.io/)。
首页已加入 17 张精选照片，目的地与题材相册待补充。

页面采用中英双语：导航先中文后英文，目的地与题材以英文标题为主、中文副标题为辅；说明文字保持简短。

## 页面

- `/`：17 张首页精选、首屏轮播和可点击放大的照片墙
- `/destinations/`：按目的地浏览
- `/destinations/<slug>/`：目的地照片网格
- `/categories/`：按题材浏览
- `/categories/<slug>/`：题材照片网格
- `/about/`：关于我

相册每页最多显示 12 张；超过后会自动生成下一页。点击照片会打开大图。

## 内容入口

首页照片与顺序在
[src/data/home-selection.json](src/data/home-selection.json) 中维护，
通过 [src/data/homepage.ts](src/data/homepage.ts) 读取。
记录保留原始文件名，网页图片副本在 `public/photos/home/`。

轮播每 6 秒淡入切换，支持上一张、下一张、暂停、键盘方向键和手机左右滑动。
悬停、键盘操作、查看大图、离开首屏或切换浏览器标签时，自动播放暂时停止。
系统启用减少动态效果时，默认暂停，仍可手动播放。

目的地和题材在 [src/data/portfolio.ts](src/data/portfolio.ts) 中维护。
原始拍摄文件夹不需要重新分类；相册照片通过 `destination` 和 `categories`
出现在两个浏览入口。首页选片与相册选片独立维护。

正式加入照片时，请先制作适合网页的副本，再填入图片路径与说明。不要把相机原始大图直接放入网站。

## 本地预览

```sh
pnpm install
astro dev --background
```

用 `astro dev status`、`astro dev logs` 和 `astro dev stop` 管理后台预览。运行 `pnpm build` 检查静态站点构建。

网站已配置为从 GitHub `main` 分支通过 GitHub Actions 发布到 GitHub Pages；本地修改不会自动上线。
