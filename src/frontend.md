# 前端部署

## 配置

首先您需要将前端源代码 clone 到本地：

```shell
git clone https://github.com/JustSignSSL/frontend
```

同样的，将 `frontend/config.json.example` 后缀中的 `.example` 移除。

`config.json` 的类型定义如下：

```ts
interface config {
    // 分别在相应的认证级别下填入在后端配置文件中设置的名称
    CAName: {
        DV: string[],
        OV: string[],
        EV: string[]
    },
    // 后端反代或部署的地址
    backend: string,
    // 在网页底部插入的文字，支持 HTML
    footer: string,
}
```

## 运行

编辑完配置文件后可以启动开发服务器查看各项功能工作是否正常：

```shell
pnpm install
pnpm run dev
```

在浏览器中打开终端输出的 URI，测试下各种功能是否正常。

## 部署

### 自部署

在工程文件夹下运行此命令来构建前端产物：

```shell
pnpm build
```

构建产物会输出到 `工程文件夹/dist` 中，将 dist 文件夹下的所有文件放到您 http 服务器的网站目录中即可完成部署。

### SaSS

JustSignSSL 的前端页面是完全静态的，这意味着它可以部署到任何地方，我们更推荐的做法是，上传整个前端工程文件夹到 Github 私有仓库，部署到 Vercel, Cloudflare Pages, Netlify 等网站托管平台，以完整地享受前端工程化带来的便利。

关于 SaSS 的部署，本文档不做赘述，如果您不熟悉这种方式，建议您参考相关文档或选择其他方式部署。
