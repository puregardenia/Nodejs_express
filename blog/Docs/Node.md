## 服务

### supervisor
每次我们更新代码后，都需要手动停止并重启应用，使用 supervisor 模块可以解决这个问题，每当我们保存修改的文件时，supervisor 都会自动帮我们重启应用。通过：

```
npm install -g supervisor
```

安装 supervisor 。使用 supervisor 命令启动 app.js：

```
supervisor app.js
```

这个博客中使用的是 运行 ``npm start`` 命令运行的
查看 package:json 文件

```json
"scripts": {
    "start": "node ./bin/www"
}
```

所以要使用以下命令来实现修改文件自动重启命令

```
supervisor ./bin/www
```

### pm2

> m2 是一个功能强大的进程管理器，通过 pm2 start 来启动 Node.js 程序，当该进程异 常退出时，pm2 会自动尝试重启进程，这样可以保证 Node.js 应用稳定运行。同时 pm2 还 可以很方便地查看其所启动的各个进程的内存占用和日志等信息。

有时候，由于 Node.js 自身的 Bug 或者使用到的第三方 C++ 模块的缺陷而导致一些底层 的错误，比如在 Linux 系统下偶尔会发生段错误（segment fault）导致进程崩溃，此时处理 uncaughtException 事件的方法就不适用了。

#### 安装 pm2

在命令行下执行 ``npm install -g pm2`` 安装 pm2 命令行工具。

#### 启动和停止

假如要启动的程序文件路径是 ``~/app.js`` ，在命令行下执行 pm2 start ~/app.js 即可 启动程序，执行 ``pm2 stop ~/app.js`` 即可停止该程序。

关于 pm2 命令行工具的详细使用方法，可访问该工具的主页来获取： [https://npmjs.org/package/pm2](https://npmjs.org/package/pm2)

## Module

### nodejs 核心模块

1. crypto ``生成散列值来加密密码``
1. fs


### 自动生成module(generator)

1. serve-favicon
2. morgan ``var logger = require('morgan');``

3. cookie-parser
1. body-parser
```
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

### 手动安装module

mongodb

express-session

connect-mongo

```
// connect-mongo
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// 将session 存到数据库中
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
```

mongodb

```
var ObjectID = require('mongodb').ObjectID;
var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
```

connect-flash

> 引入 flash 模块来实现页面通知（即成功与错误信息的显示）的功能。

async

> 解决数据库操作等嵌套层级过深的问题

package.json 中添加如下包，并 ``npm install``
```
"async": "*"
```

generic-pool

package.json 中添加如下包，并 ``npm install``

```
"generic-pool": "*"
```

express-handlebars

使用的 EJS 模板引擎,当模版文件代码比较多且逻辑复杂时，代码就变得非常难看了，满眼的 <% 和 %>。

Handlebars 是 JavaScript 一个语义模板库，通过对 view 和 data 的分离来快速构建 Web 模板。它采用 "Logic-less template"（无逻辑模版）的思路，在加载时被预编译，而不是到了客户端执行到代码时再去编译，这样可以保证模板加载和运行的速度。Handlebars 兼容 Mustache，你可以在 Handlebars 中导入 Mustache 模板。

express-handlebars  包弥补了使用 consolidate.js + handlebars 不支持从一个模版文件加载另一个模版文件的缺点

```
"express-handlebars": "*"
```