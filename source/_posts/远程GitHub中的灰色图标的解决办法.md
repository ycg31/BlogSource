---
title: 远程GitHub中的灰色图标的解决办法
tag: git
categories: 网络技术
date: 2017-08-20 05:22:09
---
## 问题描述

任何人都可以告诉我为什么我把我的文件推送到github时有灰色图标？在应用程序目录中，应该有模型，视图和控制器，但在远程GitHub中，我无法点击。

![git,github,github-for-windows](https://imgtn.gxnotes.com/images/2017/06/d6b2d26271941e283feba737ea35c3cf.jpg)

## 最佳解决方案

看起来你创建了一个子模块，指向一个不可达的远程位置。

见[this answer](https://gxnotes.com/link.php?target=https%3A//stackoverflow.com/questions/14448601/what-does-this-green-icon-mean-in-a-github-repository)。该图标在绿色时将指向子模块。因为子模块配置不正确，我认为你的情况是灰色的。

鉴于`.gitmodules`不存在，它必须被删除，留下没有远程信息的子模块。

如果进入`app`并键入`git remote -v`，您将看到该模块指向的位置。这个地方目前无法到达。

在类似的情况下，我添加了一个子模块并删除了`.gitmodules`。 GitHub的结果如下所示：

![git,github,github-for-windows](https://imgtn.gxnotes.com/images/2017/06/5e06b01294d7f9b6e5feba0735255969.jpg)

## 次佳解决方案

看起来你在文件夹中初始化了git。从子文件夹中删除git文件(rm -rf)，并创建一个新的repo并重新初始化git。

## 第三种解决方案

```bash
git rm --cached <folder_name>
```

然后转到父目录，然后执行：

```bash
git add .
git commit -m "<your_message>"
git push --all
```