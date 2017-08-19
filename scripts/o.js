var spawn = require('child_process').exec;
// Hexo 3 用户复制这段
hexo.on('new', function(data){
  spawn('start  "D:\Program Files\Typora\Typora.exe" ' + data.path);
});