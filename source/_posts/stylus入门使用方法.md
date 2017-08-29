---
title: stylus入门使用方法
tag:
  - stylus
  - css
categories: 网页技术
date: 2017-08-30 00:52:15
---

## stylus介绍

是个什么鬼？对于开发来说，CSS的弱点在于静态化。我们需要一个真正能提高开发效率的工具，`LESS`， `SASS`都在这方面做了一些贡献。

`Stylus` 是一个CSS的预处理框架，2010年产生，来自Node.js社区，主要用来给Node项目进行CSS预处理支持，所以 `Stylus` 是一种新型语言，可以创建健壮的、动态的、富有表现力的CSS。比较年轻，其本质上做的事情与 `SASS`/`LESS` 等类似，应该是有很多借鉴，所以近似脚本的方式去写CSS代码。

`Stylus`默认使用 `.styl` 的作为文件扩展名，支持多样性的CSS语法。

`Stylus`功能上更为强壮，和js联系更加紧密。所以我选择 `Stylus`，`SASS` 玩儿过一段时间，主要是这玩意依赖ruby运行，所以我放弃使用了。

## 文档参考

[官方Stylus API](http://learnboost.github.io/stylus/) 
[张鑫旭中文翻译](http://www.zhangxinxu.com/jq/stylus/)
[Try Stylus!](http://learnboost.github.io/stylus/try.html)

## Stylus安装

全局安装，安装之前你需要你安装 `nodejs` 这个怎么安装搜去哦。

```bash
$ npm install stylus -g
```

这样就算是安装完Stylus了，也可以正常使用Stylus。

```bash
Usage: stylus [options] [command] [< in [> out]]
              [file|dir ...]
Commands:
  help <prop>     Opens help info for <prop> in
                  your default browser. (OS X only)
Options:

  -u, --use <path>        Utilize the stylus plugin at <path>
  -i, --interactive       Start interactive REPL
  -w, --watch             Watch file(s) for changes and re-compile
  -o, --out <dir>         Output to <dir> when passing files
  -C, --css <src> [dest]  Convert CSS input to Stylus
  -I, --include <path>    Add <path> to lookup paths
  -c, --compress          Compress CSS output
  -d, --compare           Display input along with output
  -f, --firebug           Emits debug infos in the generated css that
                          can be used by the FireStylus Firebug plugin
  -l, --line-numbers      Emits comments in the generated CSS
                          indicating the corresponding Stylus line
  -V, --version           Display the version of Stylus
  -h, --help              Display help information  
```

## 生成CSS

### 命令行中

建立一个`stylusExample/`，再在里面建立 `src` 目录专门存放 `stylus` 文件，在里面建立 `example.styl` 文件。然后在 `stylusExample` 目录下面执行下面命令

`$ stylus --compress src/`

输出`compiled src/example.css` ，这个时候表示你生成成功了，带上`--compress`参数表示你生成压缩的CSS文件。

`$ stylus --css css/example.css css/out.styl` CSS转换成styl 
`$ stylus help box-shadow` CSS属性的帮助 
`$ stylus --css test.css` 输出基本名一致的.styl文件

### grunt生成

grunt生成 就比较爽歪歪了，具体grunt怎么玩儿，俺写了个教程[Grunt教程-前端自动化](http://jslite.io/2015/04/09/Grunt%E6%95%99%E7%A8%8B-%E5%89%8D%E7%AB%AF%E8%87%AA%E5%8A%A8%E5%8C%96/) 可以学习以下。

stylusExample 目录下创建两个文件，这两个文件是grunt必备文件。

> package.json：用于保存项目元数据。 
> Gruntfile.js：用于配置或定义任务、加载 Grunt 插件。

package.json 内容

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "测试的例子",
  "repository": {
    "type": "git",
    "url": ""
  }
}
```

然后安装必备插件，这些插件让stylus文件变更了自动生成，生成到相对应的文件目录中。如果报错你需要在命令行前面加上sudo，给它最大的执行权限。

`npm install grunt --save-dev` 
`npm install grunt-contrib-watch --save-dev` ：监视文件变动，做出相应动作。[npm>>](https://www.npmjs.com/package/grunt-contrib-watch) 
`npm install grunt-contrib-stylus --save-dev` ：stylus编写styl输出css [npm>>](https://www.npmjs.com/package/grunt-contrib-stylus)

安装出现这样的警告 `npm WARN package.json test@1.0.0 No README data` 可以不理会，如果你看着不舒服，你需要在stylusExample目录下面建立一个 README.md 文件并输入内容。也可命令执行 `echo "#stylus 学习" >> README.md`

插件执行完毕之后 `package.json` 文件变成了这样样子滴。

```scss
{
  "name": "test",
  "version": "1.0.0",
  "description": "测试的例子",
  "repository": {
    "type": "git",
    "url": ""
  },
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-contrib-stylus": "^0.21.0",
    "grunt-contrib-watch": "^0.6.1"
  }
}
```

这个时候你需要使用这些插件儿完成你的任务需要在`Gruntfile.js`里面写你的执行任务。

```scss
/// 包装函数
module.exports = function(grunt) {
    // 任务配置,所有插件的配置信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus:{
            build: {
                options: {
                    linenos: false,
                    compress: true
                },
                files: [{
                    'css/index.css': ['src/index.styl']
                }]
            }
        },
        // watch插件的配置信息
        watch: {
            another: {
                files: ['css/*','src/*.styl'],
                tasks: ['stylus'],
                options: {
                    livereload: 1337
                }
            }
        }
    });
    // 告诉grunt我们将使用插件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    // 告诉grunt当我们在终端中输入grunt时需要做些什么
    grunt.registerTask('default', ['watch']);
};
```

注意读懂上面的哦，目录高对哦，这些没有必要提醒哦，这个时候你可以好好耍一下stylus

## Stylus应用

这个时候真正的开始玩耍了哦。

### Try Stylus!

stylus

```css
body,html
    margin:0
    padding:0
```

编译成

```css
body,
html {
  margin: 0;
  padding: 0;
}
```

stylus : 强大的功能丰富的语言

```css
-pos(type, args)
  i = 0
  position: unquote(type)
  {args[i]}: args[i + 1] is a 'unit' ? args[i += 1] : 0
  {args[i += 1]}: args[i + 1] is a 'unit' ? args[i += 1] : 0

absolute()
  -pos('absolute', arguments)

fixed()
  -pos('fixed', arguments)

#prompt
  absolute: top 150px left 5px
  width: 200px
  margin-left: -(@width / 2)

#logo
  fixed: top left
```

编译成

```css
#prompt {
  position: absolute;
  top: 150px;
  left: 5px;
  width: 200px;
  margin-left: -100px;
}
#logo {
  position: fixed;
  top: 0;
  left: 0;
}
```

### nibStylus插件

stylus

```css
@import 'nib'
body
  background: linear-gradient(20px top, white, black) 
```

编译成

```css
body {
  background: -webkit-linear-gradient(20px top, #fff, #000);
  background: -moz-linear-gradient(20px top, #fff, #000);
  background: -o-linear-gradient(20px top, #fff, #000);
  background: -ms-linear-gradient(20px top, #fff, #000);
  background: linear-gradient(20px top, #fff, #000);
}
```

### Nesting(嵌套)

stylus

```css
header
    #logo
        border:1px solid red
```

编译成

```css
header #logo {
  border: 1px solid #f00;
}
```

### Flexible syntax(灵活的用法)

stylus

```css
body
    font 14px/1.5 Helvetica, arial, sans-serif
    button
    button.button
    input[type='button']
    input[type='submit']
        border-radius 5px
        
header 
    #logo,div
        font-size:14px
```

编译成

```css
body {
  font: 14px/1.5 Helvetica, arial, sans-serif;
}
body button,
body button.button,
body input[type='button'] {
  border-radius: 5px;
}
header #logo,
header div {
  font-size: 14px;
}
```

### Flexible &(灵活&)

stylus

```css
ul
    li a
        display: block
        color: blue
        padding: 5px
        html.ie &
            padding: 6px
        &:hover
            color: red
```

编译成

```css
ul li a {
  display: block;
  color: #00f;
  padding: 5px;
}
html.ie ul li a {
  padding: 6px;
}
ul li a:hover {
  color: #f00;
}
```

### Functions 方法

#### 返回值

stylus

```css
border-radius(val)
    -webkit-border-radius: val
    -moz-border-radius: val
    border-radius: val

button 
    border-radius(5px);
```

编译成

```css
button {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
```

#### Transparent mixins

不带参数

stylus

```css
border-radius()
    -webkit-border-radius: arguments
    -moz-border-radius: arguments
    border-radius: arguments

button 
    border-radius: 5px 10px;
```

编译成

```css
button {
  -webkit-border-radius: 5px 10px;
  -moz-border-radius: 5px 10px;
  border-radius: 5px 10px;
}
```

#### 默认参数

不带参数

stylus

```css
add(a, b = a)
  a + b

add(10, 5)
// => 15

add(10)
// => 20
```

#### 函数体

通过内置unit()把单位都变成px, 因为赋值在每个参数上，因此，我们可以无视单位换算。

```css
add(a, b = a)
  a = unit(a, px)
  b = unit(b, px)
  a + b

add(15%, 10deg)
// => 25
```

#### 多个返回值

通过内置unit()把单位都变成px, 因为赋值在每个参数上，因此，我们可以无视单位换算。

```css
sizes()
 15px 10px

sizes()[0]
// => 15px
```

### Variables(变量)

#### 常用方法

stylus

```css
font-size = 14px

body
    font font-size Arial, sans-seri
```

编译成

```css
body {
  font: 14px Arial, sans-seri;
}
```

#### 变量放在属性中

stylus

```css
#prompt
    position: absolute
    top: 150px
    left: 50%
    width: w = 200px
    margin-left: -(w / 2)
```

编译成

```css
#prompt {
  position: absolute;
  top: 150px;
  left: 50%;
  width: 200px;
  margin-left: -100px;
}
```

#### 块属性访问引用

stylus

```css
#prompt
    position: absolute
    width: 200px
    margin-left: -(@width / 2)
```

编译成

```css
#prompt {
  position: absolute;
  width: 200px;
  margin-left: -100px;
}
```

#### 属性有条件地定义属性

stylus:指定z-index值为1，但是，只有在z-index之前未指定的时候才这样：

```css
position()
  position: arguments
  z-index: 1 unless @z-index

#logo
  z-index: 20
  position: absolute

#logo2
  position: absolute
```

编译成

```css
#logo {
  z-index: 20;
  position: absolute;
}
#logo2 {
  position: absolute;
  z-index: 1;
}
```

#### 向上冒泡

stylus:属性会“向上冒泡”查找堆栈直到被发现，或者返回null（如果属性搞不定）下面这个例子，@color被弄成了blue.

```css
body
  color: red
  ul
    li
      color: blue
      a
        background-color: @color
```

编译成

```css
body {
  color: #f00;
}
body ul li {
  color: #00f;
}
body ul li a {
  background-color: #00f;
}
```

### Iteration(迭代)

stylus

```css
table
    for row in 1 2 3 4 5
        tr:nth-child({row})
            height: 10px * row
```

编译成

```css
table tr:nth-child(1) {
  height: 10px;
}
table tr:nth-child(2) {
  height: 20px;
}
table tr:nth-child(3) {
  height: 30px;
}
table tr:nth-child(4) {
  height: 40px;
}
table tr:nth-child(5) {
  height: 50px;
}
```

### Interpolation(插值)

stylus

```scss
vendors = webkit moz o ms official
border-radius()
    for vendor in vendors
        if vendor == official
            border-radius: arguments
        else
            -{vendor}-border-radius: arguments
#content
    border-radius: 5px
```

编译成

```css
#content {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -o-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;
}
```

### Operators(运算符)

运算符优先级 
下表运算符优先级，从最高到最低：

```css
.
 []
 ! ~ + -
 is defined
 ** * / %
 + -
 ... ..
 <= >= < >
 in
 == is != is not isnt
 is a
 && and || or
 ?:
 = := ?= += -= *= /= %=
 not
 if unless
```

### @import

`@import "reset.css"`

当使用`@import`没有`.css`扩展，会被认为是`Stylus`片段（如：`@import "mixins/border-radius"`）。

`@import`工作原理为：遍历目录队列，并检查任意目录中是否有该文件（类似node的require.paths）。该队列默认为单一路径，从`filename`选项的`dirname`衍生而来。 因此，如果你的文件名是`/tmp/testing/stylus/main.styl`，导入将显现为`/tmp/testing/stylus/`。

`@import`也支持索引形式。这意味着当你`@import blueprint`, 则会理解成`blueprint.styl`或`blueprint/index.styl`. 对于库而言，这很有用，既可以展示所有特征与功能，同时又能导入特征子集。

### @font-face

stylus

```css
@font-face
  font-family Geo
  font-style normal
  src url(fonts/geo_sans_light/GensansLight.ttf)

.ingeo
  font-family Geo
```

编译成

```css
@font-face {
  font-family: Geo;
  font-style: normal;
  src: url("fonts/geo_sans_light/GensansLight.ttf");
}
.ingeo {
  font-family: Geo;
}
```

### @media

stylus

```css
@media print
  #header
  #footer
    display none
```

编译成

```css
@media print {
  #header,
  #footer {
    display: none;
  }
}
```

### @keyframes

stylus

```css
@keyframes pulse
    0%
      background-color red
      transform scale(1.0) rotate(0deg)
    33%
      background-color blue
      -webkit-transform scale(1.1) rotate(-5deg)
```

编译成

```css
@-moz-keyframes pulse {
  0% {
    background-color: #f00;
    transform: scale(1) rotate(0deg);
  }
  33% {
    background-color: #00f;
    -webkit-transform: scale(1.1) rotate(-5deg);
  }
}
@-webkit-keyframes pulse {
  0% {
    background-color: #f00;
    transform: scale(1) rotate(0deg);
  }
  33% {
    background-color: #00f;
    -webkit-transform: scale(1.1) rotate(-5deg);
  }
}
@-o-keyframes pulse {
  0% {
    background-color: #f00;
    transform: scale(1) rotate(0deg);
  }
  33% {
    background-color: #00f;
    -webkit-transform: scale(1.1) rotate(-5deg);
  }
}
@keyframes pulse {
  0% {
    background-color: #f00;
    transform: scale(1) rotate(0deg);
  }
  33% {
    background-color: #00f;
    -webkit-transform: scale(1.1) rotate(-5deg);
  }
}
```

### CSS字面量(CSS Literal)

stylus

```css
@css {
  body {
    font: 14px;
  }
}
```

编译成

```css
body {
  font: 14px;
}
```

## 工具

- [sublime 插件 Stylus Clean Completions 代码提示](https://packagecontrol.io/packages/Stylus%20Clean%20Completions)
- [Stylus](https://packagecontrol.io/packages/Stylus)