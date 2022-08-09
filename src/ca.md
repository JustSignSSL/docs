# CA 配置

部署 JustSignSSL 之前，您需要自行建立一个包含诸多不同认证级别的根 CA 和中间 CA 系统。本文档将以 OpenSSL 为例，讲述如何生成规范的根 CA 和中间 CA 系统。

::: danger
本文档指导生成的根 CA 与中间 CA 的私钥均未设置密码，请注意私钥文件安全，或自行学习在配置文件和命令中加入相关字段或参数对私钥进行密码保护。
:::

## 根 CA 生成

新建一个目录，例如 `rootca`；

在 `rootca` 目录下创建一个文件，可以命名为 `rootca.cnf`，填入如下内容：

```ini
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = /home/iks/CA/rootca
certs = $dir/certs
crl_dir = $dir/crl
new_certs_dir = $dir/newcerts
database = $dir/db/index
serial = $dir/db/serial
RANDFILE = $dir/private/random
private_key = $dir/private/rootca.key.pem
certificate = $dir/certs/rootca.cert.pem
crlnumber = $dir/db/crlnumber
crl = $dir/crl/rootca.crl.pem
crl_extensions = crl_ext
default_crl_days = 30
default_md = sha256
name_opt = ca_default
cert_opt = ca_default
default_days = 3750
preserve = no
policy = policy_strict

[ policy_strict ]
countryName = supplied
stateOrProvinceName = optional
localityName = optional
organizationName = supplied
organizationalUnitName = optional
commonName = supplied

[ req ]
prompt = no
default_bits = 2048
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256
x509_extensions = v3_ca

[ req_distinguished_name ]
countryName = CN
stateOrProvinceName = Sichuan
localityName = Chengdu
organizationName = Urban Readjustment Limited
organizationalUnitName = Root CA - R1
commonName = CURL Root CA

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
authorityInfoAccess = OCSP;URI:http://pki.iks.moe/ocsp, caIssuers;URI:http://pki.iks.moe/static/cert/YoungdoRootCA.crt
certificatePolicies = ia5org, @pl_section
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/YoungdoRootCA.crl
extendedKeyUsage = serverAuth, clientAuth

[ pl_section ]
policyIdentifier = "X509v3 Any Policy"
CPS.1 = https://pki.iks.moe/CPS/YoungdoTrustServices

[ crl_ext ]
authorityKeyIdentifier=keyid:always

[ ocsp ]
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature
extendedKeyUsage = critical, OCSPSigning
```

注意第 5 行的 `dir`。

其中，以下内容请自定义：

```ini
countryName = CN
stateOrProvinceName = Sichuan
localityName = Chengdu
organizationName = Urban Readjustment Limited
organizationalUnitName = Root CA - R1
commonName = CURL Root CA

authorityInfoAccess = OCSP;URI:http://ocsp.iks.moe, caIssuers;URI:http://pki.iks.moe/static/cert/CURLRootCA.crt
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/CURLRootCA.crl

CPS.1 = https://pki.iks.moe/CPS/CURLCA
```
|字段|对应|示例|说明|
|:--|:-:|:-:|:-:|
|`countryName`|国家和地区名|`CN`|需要为 ISO3166 开列的二位代码之一，必填|
|`stateOrProvinceName`|州或省名|`四川` 或 `Sichuan`|选填|
|`localityName`|地区名|`成都` 或 `Chengdu`|选填|
|`organizationName`|组织名称|`Urban Readjustment Limited` 或 `成都城调有限公司`|必填|
|`organizationalUnitName`|组织单位名称|`Root CA - R1` 或 `编号为壹的使用罗纳德、阿迪和伦纳德加密算法的根证书颁发机构的运行维护部`|字面意思为组织内部的单位的名称，选填|
|`commonName`|通用名称|`CURL Root CA` 或 `成都城调有限公司根证书颁发机构`|会直接显示在证书的“颁发者”一栏，一般建议格式为“公司名称”和 Root CA，必填|

|位置|内容|替换说明|
|:-|:-|:-:|
|`authorityInfoAccess`|`http://ocsp.iks.moe`|您自己的 OCSP 响应地址|
|`authorityInfoAccess`|`http://pki.iks.moe/static/cert/CURLRootCA.crt`|您自己的根 CA 证书分发地址|
|`crlDistributionPoints`|`http://pki.iks.moe/static/crl/CURLRootCA.crl`|您自己的根 CA 证书吊销列表分发地址|
|`CPS.1`|`https://pki.iks.moe/CPS/CURLCA`|您自己的 CA 系统的存储库地址|

前三项的协议头不得为 `https`。

因非 ASCII 字符在不同硬件架构、不同操作系统、不同编程语言、不同应用程序甚至是应用程序的不同版本上的兼容性不尽完美，此处笔者建议上述内容均应翻译为**英文**填入。

在 `rootca` 目录下建立 `certs`, `db`, `private` 和 `newcerts` 四个目录；在 `rootca/db` 目录下建立空白文件 `index`；执行 `openssl rand -hex 16 > rootca/db/serial` 命令。

进入 `rootca` 目录，执行 `openssl genrsa -out private/rootca.key.pem 4096` 创建根 CA 的私钥。

执行以下命令（请一次性复制并粘贴）以创建根 CA 的证书签名请求 (CSR)：

```shell
openssl req -new \
    -config rootca.cnf \
    -sha256 -utf8 \
    -key private/rootca.key.pem \
    -out csr/rootca.csr.pem
```

执行 `openssl req -text -noout -in csr/rootca.csr.pem` 可以查看生成的 CSR 的内容。

执行以下命令（请一次性复制并粘贴）以自签名根 CA：

```shell
openssl ca -selfsign \
    -config rootca.cnf \
    -in csr/rootca.csr.pem \
    -extensions v3_ca \
    -utf8 -batch -notext \
    -days 7300 \
    -out certs/rootca.cert.pem
```

其中，`7300` 为证书有效期限，一般建议 20 年到 30 年 (7300d-10950d)。

执行 `openssl x509 -noout -text -in certs/rootca.cert.pem` 可以检查看生成的根 CA 证书的内容。

## 中间 CA 生成

在 `rootca` 目录同级新建三个目录，例如 `tlsdv`, `tlsov` 和 `tlsev`。

在 `tlsdv`, `tlsov` 和 `tlsev` 目录下创建各一个文件，可以命名为 `powerca.cnf`，填入如下内容：

```ini
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = path
certs = $dir/certs
crl_dir = $dir/crl
new_certs_dir = $dir/newcerts
database = $dir/db/index
serial = $dir/db/serial
RANDFILE = $dir/private/random
private_key = $dir/private/powerca.key.pem
certificate = $dir/certs/powerca.cert.pem
crlnumber = $dir/db/crlnumber
crl = $dir/crl/powerca.crl.pem
crl_extensions = crl_ext
default_crl_days = 7
default_md = sha256
name_opt = ca_default
cert_opt = ca_default
default_days = 3750
copy_extensions = copy
preserve = no
policy = policy_loose

[ policy_loose ]
请替换为相应内容。

[ req ]
prompt = no
default_bits = 2048
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256
x509_extensions = v3_ca

[ req_distinguished_name ]
countryName = CN
organizationName = Urban Readjustment Limited
commonName = CURL Extended Validation Server CA - R1

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ server_cert ]
请替换为相应内容。

[ crl_ext ]
authorityKeyIdentifier=keyid,issuer

[ pl_section ]
policyIdentifier = 2.16.840.1.114514.2.1
CPS.1 = https://pki.iks.moe/CPS/YoungdoTrustServices
```

`[ policy_loose ]` 和 `[ server_cert ]` 根据认证级别的不同而有不尽相同的内容。其中，EV 应当填写以下内容：

```ini
[ policy_loose ]
commonName                = supplied
organizationName          = supplied
streetAddress             = optional
localityName              = optional
stateOrProvinceName       = supplied
postalCode                = optional
countryName               = supplied
businessCategory          = supplied
jurisdictionCountryName   = supplied
jurisdictionStateOrProvinceName = optional
jurisdictionLocalityName  = optional
serialNumber              = supplied

[ server_cert ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints = critical, CA:false
keyUsage = critical, digitalSignature, keyEncipherment
authorityInfoAccess = OCSP;URI:http://ocsp.iks.moe, caIssuers;URI:http://pki.iks.moe/static/cert/CURLExtendedValidationServerCAR1.crt
certificatePolicies = ia5org, @pl_section, 2.23.140.1.1
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/CURLExtendedValidationServerCAR1.crl
extendedKeyUsage = serverAuth, clientAuth
```

OV 应当填写以下内容：

```ini
[ policy_loose ]
commonName                = supplied
organizationName          = supplied
organizationalUnitName    = optional
localityName              = supplied
stateOrProvinceName       = supplied
countryName               = supplied

[ server_cert ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints = critical, CA:false
keyUsage = critical, digitalSignature, keyEncipherment
authorityInfoAccess = OCSP;URI:http://ocsp.iks.moe, caIssuers;URI:http://pki.iks.moe/static/cert/CURLExtendedValidationServerCAR1.crt
certificatePolicies = ia5org, @pl_section, 2.23.140.1.2.2
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/CURLExtendedValidationServerCAR1.crl
extendedKeyUsage = serverAuth, clientAuth
```

DV 应当填写以下内容：

```ini
[ policy_loose ]
commonName                = supplied

[ server_cert ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints = critical, CA:false
keyUsage = critical, digitalSignature, keyEncipherment
authorityInfoAccess = OCSP;URI:http://ocsp.iks.moe, caIssuers;URI:http://pki.iks.moe/static/cert/CURLExtendedValidationServerCAR1.crt
certificatePolicies = ia5org, @pl_section, 2.23.140.1.2.1
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/CURLExtendedValidationServerCAR1.crl
extendedKeyUsage = serverAuth, clientAuth
```

其中，以下内容请自定义：

```ini
countryName = CN
organizationName = Urban Readjustment Limited
commonName = CURL Extended Validation Server CA - R1

authorityInfoAccess = OCSP;URI:http://ocsp.iks.moe, caIssuers;URI:http://pki.iks.moe/static/cert/CURLExtendedValidationServerCAR1.crt
crlDistributionPoints = URI:http://pki.iks.moe/static/crl/CURLExtendedValidationServerCAR1.crl

policyIdentifier = 2.16.840.1.114514.2.1
CPS.1 = https://pki.iks.moe/CPS/CURLCA
```

注意第 5 行的 `dir`。

|字段|对应|示例|说明|
|:--|:-:|:-:|:-:|
|`countryName`|国家和地区名|`CN`|需要为 ISO3166 开列的二位代码之一，必填|
|`organizationName`|组织名称|`Urban Readjustment Limited` 或 `成都城调有限公司`|必填|
|`commonName`|通用名称|`CURL Extended Validation Server CA - R1` 或 `成都城调有限公司编号为壹的使用罗纳德、阿迪和伦纳德加密算法的服务器用扩展认证证书颁发机构`|会直接显示在证书的“颁发者”一栏，一般建议格式为“公司名称”和"认证级别" CA，必填|

|位置|内容|替换说明|
|:-|:-|:-:|
|`authorityInfoAccess`|`http://ocsp.iks.moe`|您自己的 OCSP 响应地址|
|`authorityInfoAccess`|`http://pki.iks.moe/static/cert/CURLExtendedValidationServerCAR1.crt`|您自己的中间 CA 证书分发地址|
|`crlDistributionPoints`|`http://pki.iks.moe/static/crl/CURLExtendedValidationServerCAR1.crl`|您自己的中间 CA 证书吊销列表分发地址|
|`policyIdentifier`|`114514.2.1`|您喜欢的数字，不要超过 16 位数|
|`CPS.1`|`https://pki.iks.moe/CPS/CURLCA`|您自己的 CA 系统的存储库地址|

前三项的协议头不得为 `https`。

因非 ASCII 字符在不同硬件架构、不同操作系统、不同编程语言、不同应用程序甚至是应用程序的不同版本上的兼容性不尽完美，此处笔者建议上述内容均应翻译为**英文**填入。

在 `tlsdv`, `tlsov` 和 `tlsev`三个目录下建立 `certs`, `db`, `private` 和 `newcerts` 四个目录；在 `tlsdv`, `tlsov` 和 `tlsev`三个目录的 `db` 目录下建立空白文件 `index`；分别进入 `tlsdv`, `tlsov` 和 `tlsev`三个目录，执行 `openssl rand -hex 16 > db/serial && echo "unique_subject = no" > db/index.attr` 命令。

分别进入 `tlsdv`, `tlsov` 和 `tlsev`三个目录，执行 `openssl genrsa -out private/powerca.key.pem 4096` 创建中间 CA 的私钥。

分别进入 `tlsdv`, `tlsov` 和 `tlsev`三个目录，执行以下命令（请一次性复制并粘贴）以创建中间 CA 的证书签名请求 (CSR)：

```shell
openssl req -new \
    -config powerca.cnf \
    -sha256 -utf8 \
    -key private/powerca.key.pem \
    -out csr/powerca.csr.pem
```

执行 `openssl req -text -noout -in csr/powerca.csr.pem` 可以查看生成的 CSR 的内容。

回到 `rootca`, `tlsdv`, `tlsov` 和 `tlsev`四个目录所在的目录，执行以下命令（请一次性复制并粘贴）以使用根 CA 签名中间 CA：

```shell
openssl ca -config rootca/rootca.cnf \
    -extensions v3_intermediate_ca \
    -days 3650 -notext -md sha256 \
    -utf8 -batch \
    -in tlsev/csr/powerca.csr.pem \
    -out tlsev/certs/powerca.cert.pem
```

其中，`tlsev` 在第 2,3 次执行时注意替换为 `tlsov` 和 `tlsev`；`3650` 为证书有效期限，一般建议 10 年 (3650d)。

执行 `openssl x509 -noout -text -in certs/rootca.cert.pem` 可以检查看使用根 CA 签名的中间 CA 证书的内容。

至此，根 CA 和中间 CA 系统生成完毕。
