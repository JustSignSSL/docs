# 后端部署

## 配置

首先您需要将后端源代码 clone 到本地。

```shell
git clone https://github.com/JustSignSSL/backend
```

然后您需要将在 [CA 配置](ca.md) 章节中生成的中间 CA 文件夹复制到 `backend/src/CA` 中，CA 文件夹中的文件结构应该是类似这样的：

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

然后将 `backend/src/config.json.example` 后缀中的 `.example` 移除，将他视作 json 文件编辑。

## 反向代理

### 与前端同域名

在前端服务器的站点的 nginx 的反向代理配置填写如下：

```lua
location /backend/ {
      proxy_pass http://127.0.0.1:3000/;
}
```

其中，`/` 不能少。

### 与前端不同域名

后端服务器的站点的 nginx 的反向代理配置填写如下：

```lua
location / {
      proxy_pass http://127.0.0.1:3000;
}
```

到这里，在浏览器打开后端部署的 URI，应该可以看到 `Cannot GET /`，至此，后端部署完成。
