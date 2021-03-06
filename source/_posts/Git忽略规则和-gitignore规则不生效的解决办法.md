---
title: Git忽略规则和.gitignore规则不生效的解决办法
date: 2017-08-20 23:42:24
categories: 网络技术
tags: git
---

# Git忽略规则：

在git中如果想忽略掉某个文件，不让这个文件提交到版本库中，可以使用修改根目录中 .gitignore 文件的方法（如果没有这个文件，则需自己手工建立此文件）。这个文件每一行保存了一个匹配的规则例如：

以斜杠“/”开头表示目录；

以星号“*”通配多个字符；

以问号“?”通配单个字符

以方括号“[]”包含单个字符的匹配列表；

以叹号“!”表示不忽略(跟踪)匹配到的文件或目录；

```bash
# 此为注释 – 将被 Git 忽略
*.sample 　　 # 忽略所有 .sample 结尾的文件
!lib.sample 　 # 但 lib.sample 除外
/TODO 　　   # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/ 　　  # 忽略 build/ 目录下的所有文件
doc/*.txt    # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
fd1/*        #忽略目录 fd1 下的全部内容；注意，不管是根目录下的 /fd1/ 目录，还是某个子目录 /child/fd1/ 目录，都会被忽略；
/fd1/*       #忽略根目录下的 /fd1/ 目录的全部内容；

#此外，git 对于 .ignore 配置文件是按行从上到下进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效；
```

# 实现的三种方法

有三种方法可以实现过滤掉Git里不想上传的文件，这三种方法都能达到目的，只不过适用情景不一样。

## 第一种方法

针对单一工程排除文件，这种方式会让这个工程的所有修改者在克隆代码的同时，也能克隆到过滤规则，而不用自己再写一份，这就能保证所有修改者应用的都是同一份规则，而不是张三自己有一套过滤规则，李四又使用另一套过滤规则，个人比较喜欢这个。配置步骤如下：

在工程根目录下建立.gitignore文件，将要排除的文件或目录 写到.gitignore这个文件中，其中有两种写入方法。

### a)使用命令行增加排除文件 

排除以.class结尾的文件 echo “*.class” >.gitignore (>> 是在文件尾增加,> 是删除已经存在的内容再增加)，之后会在当前目录下生成一个.gitignore的文件。
排除bin目录下的文件 echo “bin/” >.gitignore

### b)最方便的办法是，用记事本打开，增加需要排除的文件或目录，一行增加一个。

## 第二种方法

全局设置排除文件，这会在全局起作用，只要是Git管理的工程，在提交时都会自动排除不在控制范围内的文件或目录。这种方法对开发者来说，比较省事，只要一次全局配置，不用每次建立工程都要配置一遍过滤规则。但是这不保证其他的开发者在克隆你的代码后，他们那边的规则跟你的是一样的，这就带来了代码提交过程中的各种冲突问题。
配置步骤如下：

### a）像方法（1）一样，也需要建立一个.gitignore文件，把要排除的文件写进去。

### b）但在这里，我们不规定一定要把.gitnore文件放到某个工程下面，而是任何地方，比如我们这里放到了Git默认的Home路径下，比如：/home/wangshibo/hqsb_ios

### c）使用命令方式可以配置全局排除文件 git config --global core.excludesfile ~/.gitignore，你会发现在~/.gitconfig文件中会出现excludesfile = /home/wangshibo/hqsb_ios/.gitignore。

说明Git把文件过滤规则应用到了Global的规则中。

## 第三种方法

单个工程设置排除文件，在工程目录下找到.git/info/exclude，把要排除的文件写进去：

这种方法就不提倡了，只能针对单一工程配置，而且还不能将过滤规则同步到其他开发者，跟方法（1）（2）比较起来没有一点优势。

# .gitignore规则不生效的解决办法

把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效，原因是.gitignore只能忽略那些原来没有被追踪的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未被追踪状态），然后再提交：

```bash
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

注意：
不要误解了 .gitignore 文件的用途，该文件只能作用于 Untracked Files，也就是那些从来没有被 Git 记录过的文件（自添加以后，从未 add 及 commit 过的文件）。
如果文件曾经被 Git 记录过，那么.gitignore 就对它们完全无效。