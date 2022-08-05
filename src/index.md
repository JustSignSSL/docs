# 现在开始

JustSignSSL 是一个使用 TypeScript 和 Vue.js 实现的 SSL 证书生成工具。其简化了 DV, OV 和 EV 这三种认证级别的证书的生成程序，以 Web 页面作为 GUI，实现了前端检查 `subject` 内容后再将数据交予后端以 shell 调用 OpenSSL 命令进行证书生成；其生成的证书除 CT 记录外均符合 CA/B 论坛的基线要求（例如证书链、Authority Info Access, Online Certificate Status Protocol 和 Certificate Revocation List Distribution Point 等内容）（需要编写 OpenSSL 配置文件）；其生成快捷，无需进行 Domain Control Validation，适合测试和组织内部特殊用途的认证。

在开始前，您需要配置服务器环境来满足 JustSignSSL 的需求。

## 安装 Node.js

JustSignSSL 在 Node.js 16 上工作得更好，如果您还没有安装 Node.js 16，我们推荐使用 `pnpm` 来管理 Node.js 环境。

在 POSIX 系统上，即使您没有安装 Node.js，您也可以使用以下脚本安装 pnpm：

```shell
curl -fsSL <https://get.pnpm.io/install.sh> | sh -
```

在 Windows 下（使用PowerShell）：

```shell
iwr <https://get.pnpm.io/install.ps1> -useb | iex
```

安装完毕后，可以使用 `pnpm -v` 来检查 pnpm 是否正确安装到了服务器上。

然后就可以使用以下命令安装 Node.js 16：

```shell
pnpm env use --global 16
```

## 安装 OpenSSL

如果您使用的是 POSIX 系统，OpenSSL 应该已经好好的安装在了您的系统里了，如果不是（比如 Windows），则需要自行安装。

Windows 用户请 [在此](https://indy.fulgan.com/SSL/) 根据处理器架构选择软件包，一般来讲，在 PC 和服务器上选择 `openssl-xxx-x64_86-win64.zip` 为最佳。

您可以在 [OpenSSL 官方 Wiki](https://wiki.openssl.org/index.php/Binaries) 查找当前系统可用的 OpenSSL 软件包。
