---
title: GIT相关命令
tag: git
---
#查看所有分支
~~~bash
git branch -a  
~~~
#查看本地分支
~~~bash
git branch   
~~~

# 查看远程分支

```bash
 git remote 

 git remote -v     # 带详细信息
```

# 添加远程仓库

```bash
git remote add [shortname][url]
git remote add pb git://github.com/paulboone/ticgit.git 
#名字为pb  地址为git://github.com/paulboone/ticgit.git
```



#创建分支

```bash
git branch  test   #  text为分支名称
```

# 切换分支

```bash
git checkout test 
```

# 当前分支推送到远程分支

```bash
git checkout test 
```

# 删除本地分支

```bash
git branch -d  xxxxx

或 git  br -d  xxxxx
```

# 删除远程版本

```bash
git push origin :br-1.0.0 
```

# 删除远程分支  

```bash
git branch -r -d origin/branch-name  

git push origin :branch-name   #推送一个空的本地分支到远程分支就是删除远程分支
```

