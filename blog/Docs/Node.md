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
