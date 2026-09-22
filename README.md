# Michael Wang Photography

Michael Wang 的 Astro 摄影作品集框架。目前没有加入摄影作品，也没有提交公开发布。

## 页面

- `/`：精选作品与首屏轮播
- `/destinations/`：按目的地浏览
- `/destinations/<slug>/`：目的地照片网格
- `/categories/`：按题材浏览
- `/categories/<slug>/`：题材照片网格
- `/about/`：关于我

相册每页最多显示 12 张；超过后会自动生成下一页。点击照片会打开大图。

## 内容入口

在 [src/data/portfolio.ts](src/data/portfolio.ts) 中维护目的地、题材和网站精选照片。原始拍摄文件夹不需要重新分类；同一张照片可以通过 `destination` 和 `categories` 出现在两个浏览入口，用 `featured` 控制首页精选。页面当前只显示空状态和设计占位。

正式加入照片时，请先制作适合网页的副本，再填入图片路径与说明。不要把相机原始大图直接放入网站。

## 本地预览

```sh
pnpm install
astro dev --background
```

用 `astro dev status`、`astro dev logs` 和 `astro dev stop` 管理后台预览。运行 `pnpm build` 检查静态站点构建。

网站已配置为从 GitHub `main` 分支通过 GitHub Actions 发布到 GitHub Pages；本地修改不会自动上线。
