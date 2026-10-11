# Michael Wang Photography

Michael Wang 的 Astro 摄影作品集，已发布到
[GitHub Pages](https://michael329666-del.github.io/)。
首页已加入 18 张精选照片，目的地相册已加入 10 个地点的 211 张照片。
题材相册已逐张复核并精简：风景与自然 70 张，街头与生活 89 张。
人像已加入 7 位模特的 40 张照片，每位模特一个独立相册。

29 组相似场景和连拍各保留一张，共从题材中移除 52 张。
同组中有首页精选时优先保留该照片，原有 17 张首页精选全部保留。
原有目的地相册保留全部 203 张，另加入 Colyer Lake 的 8 张。
其中 7 张归入风景与自然，码头人物照片 P1011944 归入街头与生活。
Colyer Lake 封面使用 P1011889；P1011883 作为第 18 张加入首页精选。
原片和原文件夹未修改。

页面采用中英双语：导航先中文后英文，目的地与题材以英文标题为主、中文副标题为辅；说明文字保持简短。

## 页面

- `/`：18 张首页精选、首屏轮播和可点击放大的照片墙
- `/destinations/`：十个地点的照片封面与数量，顺序与精选文件夹一致
- `/destinations/<slug>/`：目的地照片网格
- `/categories/`：按题材浏览
- `/categories/<slug>/`：题材照片网格
- `/categories/portrait/`：人像相册目录
- `/categories/portrait/model-<number>/`：每位模特的照片
- `/about/`：关于我

相册每页最多显示 12 张；超过后会自动生成下一页。点击照片会打开大图。
大图左右箭头和键盘左右键可切换整个相册的照片，跨越网格分页，首尾循环。
底部显示当前序号；按 Escape、点击关闭或大图外的空白处退出。
首页轮播和照片墙使用相同的大图操作，手机上的箭头置于照片下方。

## 内容入口

首页照片与顺序在
[src/data/home-selection.json](src/data/home-selection.json) 中维护，
通过 [src/data/homepage.ts](src/data/homepage.ts) 读取。
记录保留原始文件名，网页图片副本在 `public/photos/home/`。
P1011883 与目的地相册共用高清副本：900、1600、3840 像素宽，
WebP 质量 94；页面按显示尺寸和屏幕密度选图，大图使用 3840 像素版。
新文件名带 `-hq`，避免复用旧版图片缓存。

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
清单保留源文件夹和文件名，原图不改动。普通网页副本使用 WebP，
大图限制在 1600 × 2200 以内，缩略图限制在 900 × 1200 以内，
保留原比例并移除拍摄元数据。目的地卡片用 `coverId` 指定封面。

| 地点文件夹 | 照片数量 |
| --- | --- |
| Boston | 29 |
| Colyer Lake | 8 |
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
脚本只导入上表十个地点；首页文件夹继续由首页清单独立管理。
P1011883 的高清尺寸和质量设置已保留在导入脚本中。
脚本重建的照片清单中 `categories` 暂为空，重新导入后需恢复已审核的题材标签。

正式加入照片时，请先制作适合网页的副本，再填入图片路径与说明。不要把相机原始大图直接放入网站。

## 人像相册

人像使用“模特1”至“模特7”匿名编号，照片数量依次为
4、3、12、5、5、6、5 张；不包含“小红书”文件夹。
标题、说明、网址、图片文件名和元数据均不包含模特原姓名。

目录使用单独的拼图封面，完整保留比例和白边。
封面记录在 `src/data/portrait-covers.json`，
副本在 `public/photos/portraits/covers/`；拼图只显示在相册目录，
点进相册后仍浏览 40 张单张照片，封面不计入照片数量。

相册和照片记录在 `src/data/portrait-selection.json`，
网页副本在 `public/photos/portraits/model-<number>/`。
编号按照源文件夹的名称排序确定，源照片保持不变。
本地 `previews/portraits/source-audit.json` 保存对应关系与源文件哈希，
不提交、不发布；重新导入时先核对文件夹集合以避免更换模特编号。

```sh
node scripts/import-portraits.mjs "<portrait 文件夹绝对路径>"
```

## 本地预览

```sh
pnpm install
astro dev --background
```

用 `astro dev status`、`astro dev logs` 和 `astro dev stop` 管理后台预览。运行 `pnpm build` 检查静态站点构建。

网站已配置为从 GitHub `main` 分支通过 GitHub Actions 发布到 GitHub Pages；本地修改不会自动上线。
