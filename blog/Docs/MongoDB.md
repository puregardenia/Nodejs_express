## 安装

为了从命令提示符下运行MongoDB服务器，你必须从MongoDB目录的bin目录中执行mongod.exe文件。

    mongod.exe --dbpath D:\Data\db

将MongoDB服务器作为Windows服务运行(管理员权限)

    mongod.exe --bind_ip 127.0.0.1 --logpath "D:\Data\dbConf\mongodb.log" --logappend --dbpath "D:\Data\db" --port 27017 --serviceName "MongoDB" --serviceDisplayName "MyMongodb" --install
    mongod.exe --storageEngine "mmapv1" --logpath "D:\Data\dbConf\mongodb.log" --logappend --dbpath "D:\Data\db" --install --serviceName "MongoDB" --serviceDisplayName "mongodb" --journal

删除MongoDB Service
```
  mongod -dbpath "D:\data\db" -logpath "D:\data\dbConf\mongodb.log" -remove -serviceName "mongodb"
  mongod.exe --remove --serviceName "MongoDB"
```

## 数据库操作

document(文档)与colllect(集合):
  document相当于 mysql 中的记录(行)
  collect相当于 mysql 中的表

### 插入数据:

```
  db.person.insert({name: "puregardenia",age: 24});
```
批量插入数据:
```
  db.person.insert([
    {name:"Mary",  age:21, status:"A"},
    {name:"Lucy",  age:89, status:"A"},
    {name:"Jacky", age:30, status:"A"}
  ]);
```

### 查询数据

查询数据:
  db.person.find();
查看数据库中的集合数组:
  show collections
查询文档:
  db.collection.find(criteria,projection);
参数：
- criteria – 查询条件，文档类型，可选。
- projection– 返回的字段，文档类型，可选,若需返回所有字段，则忽略此参数。
```
db.person.find({age:{$gt: 18}}).sort({age: 1});
db.person.find(
        {age: {$gt: 18}},
        {name: 1, adress: 1}
      ).limit(5);
}
```

### 修改数据

```
  db.collection.update(query,update,{upsert:boolean,multi:boolean});
```
参数：
- query：查询条件，文档，和find中的查询条件写法一致。
- update：修改内容，文档。
- upsert(可选)：如果值为true，那么当集合中没有匹配文档时，创建文档。默认false。
- multi(可选)：如果值为true，那么将更新全部符合条件的文档，否则仅更新一个文档，默认false。
```
db.person.update(
  {age: {$gt:18}},
  {$set: {status: "A"}},
  {multi: true}
);

db.person.update(
  {age: {$lt: 30}},
  {$set: {status: "X"}},
  {multi: true}
);
```

### 增加数据

```
db.person.save({name: "Tony",age: 12,gender: "man"});
```

### 删除数据
语法:
```
db.collection.remove(
  query,
  justOne
)
```
参数:
- query：BSON类型，删除文档的条件。
- justOne：布尔类型，true：只删除一个文档，false：默认值，删除所有符合条件的文档。

```
  db.person.remove(
    {status: "D"}
  );
```

