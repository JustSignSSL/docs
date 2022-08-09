# 后端部署

## 配置

首先您需要将后端源代码 clone 到本地。

```shell
git clone https://github.com/JustSignSSL/backend
```

然后您需要将在 [CA 配置](ca.md) 章节中生成的中间 CA 文件夹复制到 `backend/CA` 中，CA 文件夹中的文件结构应如下所示：

```plaintext
├─CA
│  ├─tlsdv
│  │  ├─certs
│  │  ├─crl
│  │  ├─csr
│  │  ├─db
│  │  ├─newcerts
│  │  ├─private
│  │  └─powerca.cnf
```

之后在 `backend` 下创建 `tmp` 目录。

然后将 `backend/src/config.json.example` 后缀中的 `.example` 移除，使其作为 json 文件进行编辑。

`config.json` 的类型定义如下：

```ts
type config = {
      // 是否输出 OpenSSL 的标准输出
      debug: boolean,
      // CA 列表
      CA: CA[],
      // 跨域配置，若值为 “*” 则允许所有请求，传入 string[] 则仅允许数组内的 host
      // 示例输入：["http://127.0.0.1:5741"]
      // 注意，协议、域名或 IP 地址、端口必须完全相同才能被放行
      origin: string[] | "*",
      // 后端监听的端口
      port: number
}

interface CA {
      // CA 目录下的某套配置下的 powerca.cnf 中，
      // [ req_distinguished_name ] 块中的 commonName
      name: string,
      // 认证级别
      CAType: CAType,
      // 在 CA 目录的层级，如果在 CA/tlsdv
      // 则在这里直接写 tlsdv
      path: string
}

type CAType = 'DV' | 'OV' | 'EV'
```

## 运行

配置完成后尝试运行一下以确定其能否正常工作。

```shell
pnpm install
pnpm run build
pnpm run start
```

正常情况下，终端将输出进程监听的 URI。将其在浏览器打开，应该可以看到 `Cannot GET /`，做完这些后按 `Ctrl+C` 结束进程。

## 进程守护

### pm2

首先需要安装 pm2：

```shell
pnpm add -g pm2
```

然后运行如下命令来启动后端的进程守护：

```shell
pm2 start bin --name jss-backend
```

之后可以使用 `pm2 reload jss-backend` 来重启进程，使用 `pm2 stop jss-backend` 来终止进程，其他命令请参考 [pm2 官方文档](https://pm2.keymetrics.io/docs/usage/quick-start/)

同样的，您可以打开监听的 URI 以查看应用是否正常启动。

## 反向代理

### 与前端同域名

在前端服务器的站点的 nginx 的反向代理配置填写如下：

```lua
location /backend/ {
      proxy_pass http://127.0.0.1:3000/;
}
```

其中，`/` 不能少。`backend` 等路径请自定义，该路径的 URI 将被填写到前端配置中去。

### 与前端不同域名

后端服务器的站点的 nginx 的反向代理配置填写如下：

```lua
location / {
      proxy_pass http://127.0.0.1:3000;
}
```

到这里，在浏览器打开后端部署的 URI，应该可以看到 `Cannot GET /`。

至此，后端部署完成。
