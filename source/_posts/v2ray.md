---
title: CentOS6上安装V2ray
---
```bash
#!/bin/sh
#
# v2ray        Startup script for v2ray
#
# chkconfig: - 24 76
# processname: v2ray
# pidfile: /var/run/v2ray.pid
# description: V2Ray proxy services
#

### BEGIN INIT INFO
# Provides:          v2ray
# Required-Start:    $network $local_fs $remote_fs
# Required-Stop:     $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: V2Ray proxy services
# Description:       V2Ray proxy services
### END INIT INFO

DESC=v2ray
NAME=v2ray
DAEMON=/usr/bin/v2ray/v2ray
PIDFILE=/var/run/$NAME.pid
LOCKFILE=/var/lock/subsys/$NAME
SCRIPTNAME=/etc/init.d/$NAME
RETVAL=0

DAEMON_OPTS="-config /etc/v2ray/config.json"

# Exit if the package is not installed
[ -x $DAEMON ] || exit 0

# Read configuration variable file if it is present
[ -r /etc/default/$NAME ] && . /etc/default/$NAME

# Source function library.
. /etc/rc.d/init.d/functions

start() {
  local pids=$(pgrep -f $DAEMON)
  if [ -n "$pids" ]; then
    echo "$NAME (pid $pids) is already running"
    RETVAL=0
    return 0
  fi

  echo -n $"Starting $NAME: "

  mkdir -p /var/log/v2ray
  $DAEMON $DAEMON_OPTS 1>/dev/null 2>&1 &
  echo $! > $PIDFILE

  sleep 2
  pgrep -f $DAEMON >/dev/null 2>&1
  RETVAL=$?
  if [ $RETVAL -eq 0 ]; then
    success; echo
    touch $LOCKFILE
  else
    failure; echo
  fi
  return $RETVAL
}

stop() {
  local pids=$(pgrep -f $DAEMON)
  if [ -z "$pids" ]; then
    echo "$NAME is not running"
    RETVAL=0
    return 0
  fi

  echo -n $"Stopping $NAME: "
  killproc -p ${PIDFILE} ${NAME}
  RETVAL=$?
  echo
  [ $RETVAL = 0 ] && rm -f ${LOCKFILE} ${PIDFILE}
}

reload() {
  echo -n $"Reloading $NAME: "
  killproc -p ${PIDFILE} ${NAME} -HUP
  RETVAL=$?
  echo
}

rh_status() {
  status -p ${PIDFILE} ${DAEMON}
}

# See how we were called.
case "$1" in
  start)
    rh_status >/dev/null 2>&1 && exit 0
    start
    ;;
  stop)
    stop
    ;;
  status)
    rh_status
    RETVAL=$?
    ;;
  restart)
    stop
    start
    ;;
  reload)
    reload
  ;;
  *)
    echo "Usage: $SCRIPTNAME {start|stop|status|reload|restart}" >&2
    RETVAL=2
  ;;
esac
exit $RETVAL
```

Save as `/etc/init.d/v2ray` and then excute:

```bash
$ sudo chmod +x /etc/init.d/v2ray
$ sudo chkconfig v2ray on
$ sudo service v2ray start
 Centos6下的部署

先说明下，V2Ray提供的一键安装脚本自带守护进程，意思是如果V2Ray如果意外中止，会自动重新启动，这样使用非常方便，但是Centos6下我这种Ctrl CV党实在是不会自己写脚本，采用的是简易运行方式，所以推荐尽量能采用2.1的步骤来安装。

首先我们打开作者的Github项目，找到最新版的V2ray的下载地址

https://github.com/v2ray/v2ray-core/releases

目前最新版是v2.19，我们找到对应的v2ray-linux-64.zip文件，复制链接地址：

https://github.com/v2ray/v2ray-core/releases/download/v2.19/v2ray-linux-64.zip

然后我们Root用户Putty登录服务器，root目录下下载文件，代码如下：

wget https://github.com/v2ray/v2ray-core/releases/download/v2.19/v2ray-linux-64.zip

下载完毕后，我们解压zip文件

unzip v2ray-linux-64.zip

目录下会多一个目录名，v2ray-v2.19-linux-64（版本不同目录名有版本号的差别），为了后面操作方便，我们把目录名更名

mv v2ray-v2.19-linux-64 v2ray

进入目录，并对v2ray文件授权

cd /root/v2ray

chmod +x v2ray

这时候v2ray就能使用了，但是运行v2ray，一旦关闭putty，v2ray就会自动关闭，所以我们需要后台运行，这里采用nohup的方式。

cd /root/v2ray

nohup ./v2ray &

停止V2ray服务也很简单

killall v2ray

编辑rc.local文件，添加开机启动V2ray

vi /etc/rc.d/rc.local

打开后添加两行

cd /root/v2ray

nohup ./v2ray &

到这里安装就成功了。下面我们进入下一步，编辑配置文件。
```