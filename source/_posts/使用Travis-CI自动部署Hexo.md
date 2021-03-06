---
title: 使用Travis CI自动部署Hexo
tag:
  - Travis
  - git 
  - hexo
categories: 网络技术
date: 2017-08-20 03:41:09
---
前两天了解到了一个有趣的概念叫持续集成：

> 持续集成是一种软件开发实践。在持续集成中，团队成员频繁集成他们的工作成果，一般每人每天至少集成一次，也可以多次。每次集成会经过自动构建（包括自动测试）的检验，以尽快发现集成错误。许多团队发现这种方法可以显著减少集成引起的问题，并可以加快团队合作软件开发的速度。这篇文章简要介绍了持续集成的技巧和它最新的应用。 然后想到我的博客也恰好满足这样的需求，因为我的博客一旦有了修改，就必须要重新build并且部署，那么能不能用持续集成的思想来改造我部署博客的流程呢？

在这样的指导思想下，我完成了上一篇文章：[VPS搭配Github Webhook实现Hexo自动发布](https://xuanwo.org/2015/02/05/VPS-Hexo-Autodeploy/)，而今天我要介绍一下，在没有VPS的情况下，如何更方便的配置自己的持续集成的博客。

# 好处

- 方便：只需要一次配置，便省去了每一次编辑文档后，都需要进行`hexo d -g`的麻烦，更不必说文章增多之后渲染时间还会增长。
- 稳定：这个是最近才发现的，Github被搞了之后，很多人反映不能更新博客了，使用`Travis CI`，你只要想办法提交一个小md文档，就能进行构建。如果自己手动构建，只要一个文件上传失败，前面的工作都白费了。
- 快捷：即使是出差在外，只要能编辑Markdown，就可以撰写博客，使得Hexo拥有类似于WP一致的体验~
- 协作：博客的构建完全交由`Travis CI`进行，所以完全可以通过`Hexo`+`git`构建一个多人协作的博客平台。实际上，Hexo的[官网](https://hexo.io/)正是这样构建的。

# Travis CI介绍

> Travis CI是在软件开发领域中的一个在线的，分布式的持续集成服务，用来构建及测试在GitHub托管的代码。这个软件的代码同时也是开源的，可以在GitHub上下载到，尽管开发者当前并不推荐在闭源项目中单独使用它。 它提供了多种编程语言的支持，包括Ruby，JavaScript，Java，Scala，PHP，Haskell和Erlang在内的多种语言。许多知名的开源项目使用它来在每次提交的时候进行构建测试，比如Ruby on Rails，Ruby和Node.js。 2012年，Travis CI 决定进行募资以支持后续的开发，在这次募资活动中，许多重量级的科技公司给予了资助。

需要注意的是几个特性：

- 只支持Github
- 支持JavaScript
- 开源，免费

然后介绍一下它的原理： Travis CI会在你每一次提交之后生成一个虚拟机来执行你事先安排好的build任务，你可以调整这个虚拟机的软件环境，甚至能执行`sudo`来进行`apt-get install`。

# Travis CI配置

我们知道，Hexo的命令非常简单，一个`hexo d -g`就可以搞定。困难之处在于，Travis CI并没有对你的库进行push操作的权限。如果直接将私钥放在自己的开源库之中，这无异于将自己的代码库提交权限开放给了所有的Github使用者。所以，为了保护自己，我们需要采取一些配置操作。

*感谢Hexo作者tommy351提供的操作流程，原文可见于用 Travis CI 自動部署網站到 GitHub*

## Travis CI使用SSH 连接GitHub

### 生成SSH Key

参见[使用Github SSH Key以免去Hexo部署时输入密码](http://xuanwo.org/2015/02/07/generate-a-ssh-key/) 需要注意的是，这个SSH key不应成为你账号的全局SSH key*（因为这样Travis CI就获得了你所有代码库的提交权限，这是不正确的）*，而应该添加至https://github.com/username/ropename/settings/keys ，这样，你就控制了Travis CI的权限。

###加密私钥

下面的操作需要事先配置好gem环境，如果没有可以尝试使用[强大且配置项丰富的在线IDE应用——Cloud9](http://xuanwo.org/2014/08/07/Cloud9/)。

### 安装Travis CI的命令行工具

```bash
gem install travis # 安装travis
```

### 登陆Travis CI

需要输入Github账号和密码

```bash
travis login --auto
```

### 加密私钥并上传至Travis

正确生成后你会得到两个文件，一个叫`ssh_key`，一个叫`ssh_key.pub`。刚才我们将`ssh_key.pub`添加到了github，下面我们要加密`ssh_key`这个私钥并且上传到Travis。

```bash
travis encrypt-file ssh_key --add
```

然后Travis的客户端会自动检测当前目录中的git信息，并且添加到`.travis.yml`中去。在进行此步操作前，目录下要先存在`.travis.yml`文件，否则会报错。

### 指定SSH设置

在当前目录下新建文件`ssh_config`，内容为

```bash
Host github.com
  User git
  StrictHostKeyChecking no
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

然后指定openssl解密后的生成位置，修改Travis自动插入的解密指令(不要照抄，注意修改密钥)

```bash
- openssl aes-256-cbc -K $encrypted_xxxxxxxxxx_key -iv $encrypted_xxxxxxxxxx_iv
  -in travis.enc -out ~/.ssh/id_rsa -d
```

### 修改目录权限

紧跟那条解密指令，换行输入：

```bash
- chmod 600 ~/.ssh/id_rsa
```

注意yml格式，短杠后面的空格不能省略。

### 将密钥加入系统

紧跟上一步操作，换行输入：

```bash
- eval $(ssh-agent)
- ssh-add ~/.ssh/id_rsa
```

### 修改git信息

将之前创建的ssh_config复制到Travis的虚拟机中去，输入：

```bash
- cp ssh_config ~/.ssh/config
```

然后指定git使用者信息：

```bash
- git config --global user.name "username"
- git config --global user.email username@example.com
```

### Build配置

之前的所有操作都只是为了让Travis CI拥有push权限，下面我们开始进入到真正的Build配置当中。 之前我们用到了一个名为`.travis.yml`的文件，跟build有关的所有设置都在这个文件里面，下面的操作都在这个文件当中进行。

### 指定环境

在文件中添加如下代码：

```bash
language: node_js

node_js:
- '0.10'   //指定使用node.js最新的稳定版0.10
```

### 指定分支

在文件中添加如下代码：

```bash
branches:
  only:
  - blog    //这个分支应当使用自己的源文件分支
```

差点忘了讲- -，本方案只适用于用github来托管自己自己的hexo目录的用户。这里的分支应该使用包含有.md文档的那个分支。

### Hexo配置

首先在虚拟机中安装Hexo：

```bash
install:
- npm install hexo-cli -g
- npm install hexo --save
- npm install
```

然后执行Hexo的渲染操作

```bash
script:
- hexo clean   //分开写，方便调试可能出现的错误
- hexo d
- hexo g
```

到这里，你的Travis CI的持续集成已经配置完毕了，最后的`.travis.yml`文件内容可以参考如下：

```bash
branches:
  only:
  - blog # 这里是你监视的分支，只有blog分支更改才触发自动部署

language: node_js

sudo: false

node_js:
- '0.12' 

before_install:
- openssl aes-256-cbc -K $encrypted_xxxxxxxxx_key -iv $encrypted_xxxxxxx_iv
  -in doc/travis.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- eval $(ssh-agent)
- ssh-add ~/.ssh/id_rsa
- cp doc/ssh_config ~/.ssh/config
- git config --global user.name "yourname"
- git config --global user.email youremail
- git clone -b master git@github.com:yourname/yourrepo.git .deploy_git

install:
- npm install hexo-cli -g
- npm install
- npm install hexo-generator-feed --save
- npm install hexo-generator-sitemap --save
- npm install hexo-deployer-git --save

script:
- hexo clean
- hexo g
- hexo d
```



## Travis CI使用Token 连接GitHub

- ### **安装travis**

  Travis安装需要Ruby环境，所有需要安装Ruby,并且需要安装rubygems插件。

  ```bash
  # 安装travis
  gem isntall travis
  ```

- ### 新建配置文件

  首先打开博客项目文件夹，在项目根目录新建`.travis.yml`配置文件。

  ```bash
  $ cd 博客项目文件夹根目录
  $ touch .travis.yml
  ```

- ### **登录travis**

  ```bash
  travis login --auto
  ```

  然后会提示输入github的用户名和密码。

- ### **新建变量**

  在项目根目录下执行:

  ```bash
  # 这里的 REPO_TOKEN 是变量名,在后面的配置文件中会用到
  # TOKEN 是上面github生成的Token
  travis encrypt 'REPO_TOKEN=<TOKEN>' --add
  ```

  此操作会在`.travis.yml`文件中添加下面的信息

  ```bash
  env:
  global:
    secure: fxBE17yzFhC2+FjwVLYbgIhggyfliv3dFCDozTJD7U3n
  ```

### 编辑配置文件

​      打开Travis配置文件**.travis.yml**，添加如下信息：

```bash
language: node_js
node_js:
- "4"  # nodejs的版本
branches:
  only:
  - dev  # 设置自动化部署的源码分支
env:
  global:
    secure: [加密后的Token]
before_install:
- export TZ='Asia/Shanghai'  # 设置时区
- npm install -g hexo
- npm install -g hexo-cli
before_script:
# 设置github账户信息
- git config --global user.name "SeayXu" #设置github用户名
- git config --global user.email SeayXu@163.com #设置github用户邮箱
# github仓库操作
- sed -i'' "s~git@github.com:SeayXu/seayxu.github.io.git~https://${REPO_TOKEN}:x-oauth-basic@github.com/SeayXu/seayxu.github.io.git~" _config.yml
# 安装依赖组件
install:
- npm install
# 执行的命令
script:
- hexo clean
- hexo generate
# 执行的成功后执行 
after_success:
- hexo deploy
```

完整配置文件可以[参考这个](https://github.com/SeayXu/seayxu.github.io/blob/dev/.travis.yml~~)。

转载备用，这个我没配置，因为手上没Lunix系统，等回头装个的虚拟机尝试下，我是用AppVeyor。