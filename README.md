# Michael Wang Photography

Michael Wang 的 Astro 摄影作品集，已发布到
[GitHub Pages](https://michael329666-del.github.io/)。
首页已加入 17 张精选照片，目的地相册已加入 9 个地点的 203 张照片。
题材相册已逐张复核：风景与自然 106 张，街头与生活 97 张。
人像待从单独的素材中选片。

页面采用中英双语：导航先中文后英文，目的地与题材以英文标题为主、中文副标题为辅；说明文字保持简短。

## 页面

- `/`：17 张首页精选、首屏轮播和可点击放大的照片墙
- `/destinations/`：九个地点的照片封面与数量，顺序与精选文件夹一致
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

轮播每 3 秒开始切换，淡入淡出持续 1.6 秒，支持上一张、下一张、暂停、键盘方向键和手机左右滑动。
鼠标悬停时继续播放，播放/暂停按钮的提示会显示当前状态。
键盘操作、查看大图、离开首屏或切换浏览器标签时，自动播放暂时停止。
系统启用减少动态效果时，默认暂停，仍可手动播放。

目的地和题材在 [src/data/portfolio.ts](src/data/portfolio.ts) 中维护。
原始拍摄文件夹不需要重新分类；相册照片通过 `destination` 和 `categories`
出现在两个浏览入口。首页选片与相册选片独立维护。

目的地照片清单在
[src/data/destination-selection.json](src/data/destination-selection.json)，
图片副本在 `public/photos/destinations/<slug>/`。
清单保留源文件夹和文件名，原图不改动。网页副本使用 WebP，
大图限制在 1600 × 2200 以内，缩略图限制在 900 × 1200 以内，
保留原比例并移除拍摄元数据。目的地卡片用 `coverId` 指定封面。

| 地点文件夹 | 照片数量 |
| --- | --- |
| Boston | 29 |
| DC | 20 |
| Harrisburg | 9 |
| HongKong | 13 |
| Miami | 54 |
| Orlando | 6 |
| Penn's Cave& Wildlife | 40 |
| Sedona | 26 |
| St.Paul | 6 |

重新从桌面精选文件夹生成网页副本：

```sh
node scripts/import-destinations.mjs
```

也可以把其他精选文件夹的绝对路径作为命令参数。
脚本只导入上表九个地点；首页文件夹继续由首页清单独立管理。
脚本重建的照片清单中 `categories` 暂为空，重新导入后需恢复已审核的题材标签。

正式加入照片时，请先制作适合网页的副本，再填入图片路径与说明。不要把相机原始大图直接放入网站。

## 本地预览

```sh
pnpm install
astro dev --background
```

用 `astro dev status`、`astro dev logs` 和 `astro dev stop` 管理后台预览。运行 `pnpm build` 检查静态站点构建。

网站已配置为从 GitHub `main` 分支通过 GitHub Actions 发布到 GitHub Pages；本地修改不会自动上线。
