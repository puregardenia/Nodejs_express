# 服务

## supervisor
每次我们更新代码后，都需要手动停止并重启应用，使用 supervisor 模块可以解决这个问题，每当我们保存修改的文件时，supervisor 都会自动帮我们重启应用。通过：

```
npm install -g supervisor
```

安装 supervisor 。使用 supervisor 命令启动 app.js：

```
supervisor app.js
```

# Module

## nodejs 核心模块

- crypto ``生成散列值来加密密码``
- 


## 自动生成module(generator)

- serve-favicon
- morgan
```
var logger = require('morgan');
```
- cookie-parser
- body-parser
```
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```
- 


## 手动安装module

- express-session
- connect-mongo
```
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
- connect-flash
> 引入 flash 模块来实现页面通知（即成功与错误信息的显示）的功能。

