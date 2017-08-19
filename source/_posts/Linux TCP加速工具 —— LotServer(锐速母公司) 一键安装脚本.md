---
title: Linux TCP加速工具 —— LotServer(锐速母公司) 一键安装脚本
---

# Linux TCP加速工具 —— LotServer(锐速母公司) 一键安装脚本

锐速(ServerSpeeder)可以说是LotServer的马甲，是针对民用的，而LotServer则是针对企业用户的，锐速现在基本上已经关了，而这个LotServer还在持续运营。

**Only for Linux.**

**从根本原因上解决锐速断流问题，断流的根本原因是没有完整破解验证机制。**

1. 支持自动检测公网网卡，多个网卡也能区分。
2. 支持自动适配内核 (需锐速支持)。
3. 添加询问是否开启accppp功能 (实测并开启后没有效果)。
4. 默认设置为G口宽带 (听说设置大点可以提高速度)。
5. 支持一键完全卸载 (此脚本安装的无残留)。
6. **所需文件均来自 GiuHub，不放心可自行查阅 (完全公开)。**
7. 不支持自动更换内核，请自行更换(网上教程非常多)。
8. **不支持OpenVZ，不需要尝试，会告诉你找不到网卡。**

```
注意：OVZ虚拟化的VPS并不支持锐速加速器的安装，KVM和XEN应该基本都可以。
```

**作者博客：https://moeclub.org/2017/03/08/14/**

安装文件 **appex.zip** 为 LotServer 的，(感谢 LotServer 提供安装文件)。

使用前请日常` apt-get update / yum update `，欢迎反馈bug(各种安装错误)。

**使用前建议先查看linux支持内核列表，对照一下系统和内核是否可以安装 LotServer！**

服务器使用`uname -r`命令来查询内核版本，例如返回的是`3.2.0-4-amd64`，`3.2.0-4-amd64`就是你的内核版本。

> 强烈推荐大家使用 **Debian7 x64系统 | 3.2.0-4-amd64内核** ，这个系统和内核无论是锐速、Lotserver还是BBR，除了配置太低的我都没安装失败过！

## 安装LotServer

```bash
wget --no-check-certificate -qO /tmp/appex.sh "https://raw.githubusercontent.com/0oVicero0/serverSpeeder_Install/master/appex.sh" && bash /tmp/appex.sh 'install'


```

安装一开始的时候，会提示：

```bash
Press Enter to Continue...
# 这个是提示你按回车键继续


```

如果安装过程中没问题的话，最后会提示：

```bash
Accelerate VPN (PPTP,L2TP,etc.)? [n]:
# 是否加速VPN
 
Auto load ServerSpeeder on linux start-up? [y]:
# 是否开机启动
 
Run ServerSpeeder now? [y]:
# 是否现在启动锐速
 
# 全部默认回车即可。


```

最后出现这样的提示就说明安装并启动成功：

```bash
[Running Status]
ServerSpeeder is running!
version              3.11.20.4
 
[License Information]
License              6001ADDF578B6C0E (valid on current device)
MaxSession           unlimited
MaxTcpAccSession     unlimited
MaxBandwidth(kbps)   1024000
ExpireDate           2035-12-31
....
# 以下省略....

```

## 卸载LotServer

```bash
wget --no-check-certificate -qO /tmp/appex.sh "https://raw.githubusercontent.com/0oVicero0/serverSpeeder_Install/master/appex.sh" && bash /tmp/appex.sh 'uninstall'

```

## 使用说明

```bash
/appex/bin/serverSpeeder.sh start
# 启动 LotServer
 
/appex/bin/serverSpeeder.sh stop
# 停止 LotServer
 
/appex/bin/serverSpeeder.sh restart
# 重启 LotServer
 
/appex/bin/serverSpeeder.sh status
# 状态查询
 
/appex/bin/serverSpeeder.sh renewLic
# 更新许可


```

[代码托管地址](https://github.com/0oVicero0/serverSpeeser_Install)

[LotServer 完整使用介绍 PDF手册](https://github.com/0oVicero0/serverSpeeder_Install/blob/master/lotServer.pdf)

**安装完了，想要自己修改配置最大化加速效果，那么请看：锐速(ServerSpeeder/LotServer)配置参数简单说明，合理修改配置 提高加速效果**

这个LotServer与锐速(ServerSpeeder)的加速区别并不大，不过91yun的破解版因为破解不完整导致会出现断流等情况，而这个 LotServer 则没有这种问题。