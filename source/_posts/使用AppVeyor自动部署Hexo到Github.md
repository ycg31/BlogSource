---
title: 使用AppVeyor自动部署Hexo到Github
tag: hexo,appveyor,git
---
# 一、转载别人的教程
想必很多人会把Hexo生成出来的静态网站放到GitHub Pages来进行托管。一般发布Hexo博客的流程是，首先在本地搭建Hexo的环境，编写新文章，然后利用`hexo deploy`来发布到Git。那么对于本地的Hexo的原始文件怎么管理呢？如果换电脑了怎么办？如果没有对原始文件进行备份，突然有一天你的本地环境挂了导致源文件丢失，那不就呵呵了。也许你会想到用Dropbox或者其他方案来对源文件进行备份，但是每次更新完博客，需要备份好源文件，然后执行`hexo deploy`进行发布，是不是很麻烦？换了电脑之后又要重新搭建本地环境，是不是很蛋疼？

那么接下来我们就来说说如何优雅愉快地对我们的Hexo进行版本管理和发布。

​      既然我们已经用了GitHub来托管我们生成出来的静态网站，那么为什么不也把Hexo博客的源文件也host在GitHub上呢。那么问题来了，如果我们把Hexo博客的源文件托管在GitHub上，我们的发布流程就会变为：

1. 执行`git push`把更新的源文件push到托管源文件的GitHub Repo (我们称之为Source Repo)
2. 执行`hexo deploy`来更新托管静态网站的GitHub Pages (我们称之为Content Repo)

​     这样看来，每次更新博客要经历两个步骤，并不是那么straightforward。那么有没有办法做到既能使用GitHub进行版本控制，又能做到一键发布呢？

​      答案是肯定的。这里用到了[持续集成](https://en.wikipedia.org/wiki/Continuous_integration)也就是我们一直所说的CI来完成一键发布：当有新的change push到Source Repo时，自动执行CI脚本，生成最新的静态网站发布到Content Repo，一气呵成。那么我使用什么CI工具来做呢？我们可以使用像Travis CI这样的Hosted CI Service，也可以使用Jenkins或者TeamCity来搭建CI server。如果自己来搭建CI Server，费时费力，又要花钱来买Server来host CI service，肯定不是一个很好的选择。那么我们选哪个Hosted CI Service呢？其实今年在公司的一个项目中我们就选择了AppVeyor。当初在做investigation的时候，第一个想到的就是用Travis CI，然而我司大多数的开发环境都是Windows，而且当时的项目有Python, PowerShell, Java等，那时PowerShell还只支持Windows，所以需要选择一个支持Windows的CI Service。于是，Scott Hanselman安利的[AppVeyor](http://www.hanselman.com/blog/AppVeyorAGoodContinuousIntegrationSystemIsAJoyToBehold.aspx)就成为了一个备选。访问[AppVeyor官网](https://www.appveyor.com/)，映入眼帘的大标题就是`#1 Continuous Delivery service for Windows`。刚开始的时候内心一阵嘲笑，Top 10的CI Service就你支持Windows，你不是第一那谁是第一？结果在之后的项目使用中，发现AppVeyor比Travis CI好用太多。这里就不具体展开了，继续进入正题。

​     使用AppVeyor来建立CI非常方便，主要是以下步骤：

## 1. 注册并登陆AppVeyor

   访问[AppVeyor登陆页面](https://ci.appveyor.com/login)，使用你的GitHub账号登陆即可。                                        

   ​

   [![login](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-login.png)](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-login.png)

   

## 2.  添加Project

   在[AppVeyor Projects页面](https://ci.appveyor.com/projects/new)，添加相应的GitHub Source Repo。                                     

   ​

   [![add-project](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-add-project.png)](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-add-project.png)

   ## 

## 3.  添加appveyor.yml到Source Repo

   接下来，你需要把appveyor.yml添加到Source Repo的根目录下。具体的appveyor.yml如下:

   ```bash
   clone_depth: 5
   environment:
   access_token:
       secure: [Your GitHub Access Token]

   install:
   - node --version
   - npm --version
   - npm install
   - npm install hexo-cli -g
   build_script:
   - hexo generate

   artifacts:
   - path: public
        on_success:
   - git config --global credential.helper store
   - ps: Add-Content "$env:USERPROFILE\.git-credentials" "https://$($env:access_token):x-oauth-basic@github.com`n"
   - git config --global user.email "%GIT_USER_EMAIL%"
   - git config --global user.name "%GIT_USER_NAME%"
   - git clone --depth 5 -q --branch=%TARGET_BRANCH% %STATIC_SITE_REPO% %TEMP%\static-site
   - cd %TEMP%\static-site
   - del * /f /q
   - for /d %%p IN (*) do rmdir "%%p" /s /q
   - SETLOCAL EnableDelayedExpansion & robocopy "%APPVEYOR_BUILD_FOLDER%\public" "%TEMP%\static-site" /e & IF !ERRORLEVEL! EQU 1 (exit 0) ELSE (IF !ERRORLEVEL! EQU 3 (exit 0) ELSE (exit 1))
   - git add -A
   - git commit -m "Update Static Site" 
   - git push origin %TARGET_BRANCH%
   - appveyor AddMessage "Static Site Updated"
   ```

   你唯一需要做的就是替换[Your GitHub Access Token]，关于生成Access Token，可以参考这篇[文章](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)。在GitHub生成好Access Token之后，你需要到[AppVeyor加密页面](https://ci.appveyor.com/tools/encrypt)把Access Token加密之后再替换[Your GitHub Access Token]  

   ​

   [![encrypt](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-encrypt.png)](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-encrypt.png)

  

## 4. 设置Appveyor

   添加好appveyor.yml之后，再到Appveyor portal设置以下四个变量。STATIC_SITE_REPO就是Content Repo的地址，TARGET_BRANCH就是你Content Repo的branch，一般默认就是master，GIT_USER_EMAIL和GIT_USER_NAME就是你GitHub账号的信息。                                       

   ​

   [![setting](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-setting.png)](https://formulahendry.github.io/assets/img/hexo-ci/appveyor-setting.png)

好了，一切大功告成！试一下`git push`你的change到Source Repo，几分钟内，你的博客就自动更新了！

背后的过程如下:

1. Git push to Source Repo
2. –> AppVeyor CI
3. –> Update GitHub Pages Content Repo
4. –> Generate your Hexo blog site

    
# 折腾过程中遇到的问题
部署成功后，所有创建的html文件全部是空的，几经周折才发现，原来是缺少主题文件，所有生成的html文件全是空的，提示错误WARN No layout，再到GitHub上一看，主题文件夹变成了灰色。具体如何解决灰色文件夹可以参考我转载的另一篇文章。
