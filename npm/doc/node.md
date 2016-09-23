一般js的逻辑代码我们放在lib目录中，所以很多包的index.js文件会有如下代码：

```
module.exports = require('./lib/mongodb');//mongodb包的index.js文件
```

如果这个Node.js包还包括了部分C/C++代码，我们一般把这部分代码放在src文件目录中，如果用到第三方的C/C++类库，通常放在deps目录下。
示例代码放在 example 文件下

.npmignore 文件描述了我们过滤掉那些文件不发布到npm上去，一般必须过滤掉的目录就是node_modules。这个目录因为可能涉及到C/C++模块的编译，必须每次npm install重新创建，所以不必提交到npm上。同样不必提交到npm上的还有我们之后要介绍的build文件夹。

