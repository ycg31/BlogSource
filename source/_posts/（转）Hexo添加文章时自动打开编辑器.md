---
title: （转）Hexo添加文章时自动打开编辑器
date: 2017-08-20 03:20:09
tags: hexo
categories: 网站相关
---

[![阅读全文](http://7xkj6q.com1.z0.glb.clouddn.com/blog/image/jpg/hexo_logo.jpg)](https://notes.wanghao.work/2015-06-29-Hexo%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E6%97%B6%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E5%99%A8.html)

[](https://notes.wanghao.work/2015-06-29-Hexo%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E6%97%B6%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E5%99%A8.html)

在`Hexo`中新建一篇博文非常简单，只需要在命令行中键入以下命令然后回车即可：

```
hexo new "The title of your blog"
```

此后Hexo便会在Hexo的根目录的`source`文件夹下的`_posts`目录下自动帮你创建相应的md文件。然后我们打开该目录，找到刚刚Hexo自动生成的文件打开编辑即可。

但是当我们的博文比较多，这样我们就需要在成堆的Markdown文件中找到刚才自动生成的文件，这样做显然是一件比较痛苦的事情。



- 首先在Hexo目录下的`scripts`目录中创建一个JavaScript脚本文件。
- 如果没有这个`scripts`目录，则新建一个。
- `scripts`目录新建的JavaScript脚本文件可以任意取名。

通过这个脚本，我们用其来监听`hexo new`这个动作，并在检测到`hexo new`之后，执行编辑器打开的命令。

如果你是windows平台的Hexo用户，则将下列内容写入你的脚本：

```
var spawn = require('child_process').exec;

// Hexo 2.x 用户复制这段
hexo.on('new', function(path){
  spawn('start  "markdown编辑器绝对路径.exe" ' + path);
});

// Hexo 3 用户复制这段
hexo.on('new', function(data){
  spawn('start  "markdown编辑器绝对路径.exe" ' + data.path);
});
```

如果你是Mac平台Hexo用户，则将下列内容写入你的脚本：

```
var exec = require('child_process').exec;

// Hexo 2.x 用户复制这段
hexo.on('new', function(path){
    exec('open -a "markdown编辑器绝对路径.app" ' + path);
});
// Hexo 3 用户复制这段
hexo.on('new', function(data){
    exec('open -a "markdown编辑器绝对路径.app" ' + data.path);
});
```

保存并退出脚本之后，在命令行中键入：

```
hexo new "auto open editor test"
```

是不是就顺利的自动打开了自动生成的md文件啦~

Enjoy it！

- **本文作者：** 夏末
- **本文链接：** [https://notes.wanghao.work/2015-06-29-Hexo添加文章时自动打开编辑器.html](https://notes.wanghao.work/2015-06-29-Hexo%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E6%97%B6%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%BC%96%E8%BE%91%E5%99%A8.html)
- **版权声明： **本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) 许可协议。转载请注明出处！