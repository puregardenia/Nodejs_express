//var mongodb = require('./db');
var crypto = require('crypto');
var async = require('async');


// 数据库连接池模式
var Db = require('./db');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name     : 'mongoPool',
    create   : function(callback) {
        var mongodb = Db();
        mongodb.open(function (err, db) {
            callback(err, db);
        })
    },
    destroy  : function(mongodb) {
        mongodb.close();
    },
    max      : 100,
    min      : 5,
    idleTimeoutMillis : 30000,
    log      : true
});


function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: head
    };
    //数据库连接池操作数据库
    async.waterfall([
        function (cb) {
            pool.acquire(function (err, mongodb) {
                cb(err, mongodb);
            });
        },
        function (mongodb, cb) {
            mongodb.collection('users', function (err, collection, mongodb) {
                cb(err, collection, mongodb);
            });
        },
        function (collection, mongodb, cb) {
            //将用户数据插入 users 集合
            collection.insert(user, {
                safe: true
            }, function (err, user, mongodb) {
                cb(err, user, mongodb);//成功！err 为 null，并返回存储后的用户文档
            });
        }
    ], function (err, user, mongodb) {
        pool.release(mongodb);
        callback(err, user[0]);
    });

    //操作数据库
    //async.waterfall([
    //    function (cb) {
    //        mongodb.open(function (err, db) {
    //            cb(err, db);
    //        });
    //    },
    //    function (db, cb) {
    //        db.collection('users', function (err, collection) {
    //            cb(err, collection);
    //        });
    //    },
    //    function (collection, cb) {
    //        //将用户数据插入 users 集合
    //        collection.insert(user, {
    //            safe: true
    //        }, function (err, user) {
    //            cb(err, user);//成功！err 为 null，并返回存储后的用户文档
    //        });
    //    }
    //], function (err, user) {
    //    mongodb.close();
    //    callback(err, user[0]);
    //});



    //打开数据库
    //mongodb.open(function (err, db) {
    //    if (err) {
    //        return callback(err);//错误，返回 err 信息
    //    }
    //    //读取 users 集合
    //    db.collection('users', function (err, collection) {
    //        if (err) {
    //            mongodb.close();
    //            return callback(err);//错误，返回 err 信息
    //        }
    //        //将用户数据插入 users 集合
    //        collection.insert(user, {
    //            safe: true
    //        }, function (err, user) {
    //            mongodb.close();
    //            if (err) {
    //                return callback(err);//错误，返回 err 信息
    //            }
    //            callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
    //        });
    //    });
    //});
};

//读取用户信息
User.get = function(name, callback) {

    // 数据库连接池操作数据库
    async.waterfall([
        function (cb) {
            pool.acquire(function (err, mongodb) {
                cb(err, mongodb);
            });
        },
        function (mongodb, cb) {
            mongodb.collection('users', function (err, collection, mongodb) {
                cb(err, collection, mongodb);
            });
        },
        function (collection, mongodb, cb) {
            collection.findOne({
                name: name
            }, function (err, user, mongodb) {
                cb(err, user, mongodb);
            })
        }
    ], function (err, user, mongodb) {
        pool.release(mongodb);
        callback(err, user);
    });

    //async.waterfall([
    //    function (cb) {
    //        mongodb.open(function (err, db) {
    //            cb(err, db);
    //        });
    //    },
    //    function (db, cb) {
    //        db.collection('users', function (err, collection) {
    //            cb(err, collection);
    //        });
    //    },
    //    function (collection, cb) {
    //        collection.findOne({
    //            name: name
    //        }, function (err, user) {
    //            cb(err, user);
    //        })
    //    }
    //], function (err, user) {
    //    mongodb.close();
    //    callback(err, user);
    //});

    //打开数据库
    //mongodb.open(function (err, db) {
    //    if (err) {
    //        return callback(err);//错误，返回 err 信息
    //    }
    //    //读取 users 集合
    //    db.collection('users', function (err, collection) {
    //        if (err) {
    //            mongodb.close();
    //            return callback(err);//错误，返回 err 信息
    //        }
    //        //查找用户名（name键）值为 name 一个文档
    //        collection.findOne({
    //            name: name
    //        }, function (err, user) {
    //            mongodb.close();
    //            if (err) {
    //                return callback(err);//失败！返回 err 信息
    //            }
    //            callback(null, user);//成功！返回查询的用户信息
    //        });
    //    });
    //});
};