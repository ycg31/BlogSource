---
title: git pull 和 clone的区别及用法
tag: git
categories: 网络技术
date: 2017-08-20 05:22:09
---
# 一、git pull
git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。

完整格式：$ git pull <远程主机名> <远程分支名>:<本地分支名>

完整格式举例：比如，取回origin主机的next分支，与本地的master分支合并，需要写成下面这样，

## （1）$ git pull origin next:master：如果远程分支是与当前分支合并，则冒号后面的部分可以省略。



## （2）$ git pull origin next：上面命令表示，取回origin/next分支，再与当前分支合并。实质上，这等同于先做git fetch，再做git merge。




```bash
$ git fetch origin
$ git merge origin/next
```

在某些场合，Git会自动在本地分支与远程分支之间，建立一种追踪关系(tracking)。比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动”追踪”origin/master分支。

Git也允许手动建立追踪关系，git branch --set-upstream master origin/next
上面命令指定master分支追踪origin/next分支。如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。

```
$ git pull origin
```


上面命令表示，本地的当前分支自动与对应的origin主机”追踪分支”(remote-tracking branch)进行合并。
如果当前分支只有一个追踪分支，连远程主机名都可以省略。

# 二、get clone
远程操作的第一步，通常是从远程主机克隆一个版本库，这时就要用到git clone命令。
##（1）$ git clone <版本库的网址>
比如，克隆jQuery的版本库。
```bash
$ git clone https://github.com/jquery/jquery.git
```


该命令会在本地主机生成一个目录，与远程主机的版本库同名。如果要指定不同的目录名，可以将目录名作为git clone命令的第二个参数。
## （2）$ git clone <版本库的网址> <本地目录名>
git clone支持多种协议，除了HTTP(s)以外，还支持SSH、Git、本地文件协议等，下面是一些例子。
```bash
$ git clone http[s]://example.com/path/to/repo.git/
$ git clone ssh://example.com/path/to/repo.git/
$ git clone git://example.com/path/to/repo.git/
$ git clone /opt/git/project.git
$ git clone file:///opt/git/project.git
$ git clone ftp[s]://example.com/path/to/repo.git/
$ git clone rsync://example.com/path/to/repo.git/
```


## （3）SSH协议还有另一种写法。
```bash
$ git clone [user@]example.com:path/to/repo.git/
```


通常来说，Git协议下载速度最快，SSH协议用于需要用户认证的场合。
