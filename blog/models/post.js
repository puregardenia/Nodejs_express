/**
 * Created by Administrator on 2016/9/12.
 */
var ObjectID = require('mongodb').ObjectID;

//var mongodb = require('./db');

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

var markdown = require('markdown').markdown;

function Post (name, head, title, tags, post){
    this.name = name;
    this.head = head;
    this.title = title;
    this.tags = tags;
    this.post = post;
}

module.exports = Post;

Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    var post = {
        name: this.name,
        head: this.head,
        time: time,
        title: this.title,
        tags: this.tags,
        post: this.post,
        comments: [],
        reprint_info: {},
        pv: 0
    };
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            collection.insert(post, {
                safe: true
            }, function (err) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });

    });
}

//获取一页文章
Post.getTen = function (name, page, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1)*10,
                    limit: 10
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    pool.release(mongodb);;
                    if (err) {
                        return callback(err);
                    }
                    //解析 markdown 为 html
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs, total);
                });
            });
        });
    });
}

//获取一篇文章
Post.getOne = function (_id, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function (err, doc) {
                if (err) {
                    pool.release(mongodb);;
                    return callback(err);
                }
                if (doc) {
                    //每访问1次，pv值加1
                    collection.update({
                        "_id": new ObjectID(_id)
                    }, {
                        $inc: {"pv":1}
                    }, function (err) {
                        pool.release(mongodb);;
                        if (err) {
                            return callback(err);
                        }
                    });
                    //解析 markdown 为 html
                    doc.post = markdown.toHTML(doc.post);
                    if (doc.comments) {
                        doc.comments.forEach(function (comment) {
                            comment.content = markdown.toHTML(comment.content);
                        });
                    }

                }

                callback(null, doc);//返回查询的一篇文章
            });
        });
    });
}

//编辑一篇文章
Post.edit = function (_id, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function (err, doc) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null, doc);//返回查询的一篇文章（markdown 格式）
            });
        });
    });
}

//更新一篇文章及其相关信息
Post.update = function(_id, post, callback) {
    //打开数据库
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //更新文章内容
            collection.update({
               "_id": new ObjectID(_id)
            }, {
                $set: {post: post}
            }, function (err) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//删除一篇文章
Post.remove = function (_id, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        //读取 Posts 集合
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //查询要删除的文档
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function (err, doc) {
                if (err) {
                    pool.release(mongodb);;
                    return callback(err);
                }
                //如果有 reprint_from，即该文章是转载来的，先保存下来 reprint_from
                var reprint_from = "";
                if (doc.reprint_info && doc.reprint_info.reprint_from) {
                    reprint_from = doc.reprint_info.reprint_from;
                }
                if (reprint_from != "") {
                    //更新原文章所在文档的 reprint_to
                    collection.update({
                        "_id": new ObjectID(reprint_from._id)
                    }, {
                        $pull: {
                            "reprint_info.reprint_to": {
                                "name": doc.name,
                                "day": doc.time.day,
                                "title": doc.title
                            }
                        }
                    }, function (err) {
                        if (err) {
                            pool.release(mongodb);;
                            return callback(err);
                        }
                    });
                }
                //根据用户名、日期和标题查找并删除一篇文章
                collection.remove({
                    "_id": new ObjectID(_id)
                }, {
                    w: 1
                }, function (err) {
                    pool.release(mongodb);;
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

//返回所有文章存档信息
Post.getArchive = function (callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            pool.release(mongodb);;
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            collection.find({}, {
                "name": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

//返回所有标签
Post.getTags = function (callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            pool.release(mongodb);;
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //distinct 用来找出给定键的所有不同值
            collection.distinct("tags", function (err, docs) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

//返回含有特定标签的所有文章
Post.getTag = function(tag, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //查询所有 tags 数组内包含 tag 的文档
            //并返回只含有 name、time、title 组成的数组
            collection.find({
                "tags": tag
            }, {
                "name": 1,
                "time": 1,
                "title": 1
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

//返回通过标题关键字查询的所有文章信息
Post.search = function (keyword, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            pool.release(mongodb);;
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            var pattern = new RegExp(keyword, 'i');
            collection.find({
                "title": pattern
            }, {
                "name": 1,
                "title": 1,
                "time": 1
            }).sort({
                time: -1
            }).toArray(function (err, docs) {
                pool.release(mongodb);;
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
}

//转载一篇文章
Post.reprint = function (reprint_from, reprint_to, callback) {
    pool.acquire(function (err, mongodb) {
        if (err) {
            pool.release(mongodb);;
            return callback(err);
        }
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                pool.release(mongodb);;
                return callback(err);
            }
            //找到被转载的文章的源文档
            collection.findOne({
                "_id": new ObjectID(reprint_from._id)
            }, function (err, doc) {
                if (err) {
                    pool.release(mongodb);;
                    return callback(err);
                }

                var date = new Date();
                var time = {
                    date: date,
                    year: date.getFullYear(),
                    month: date.getFullYear() + '-' + (date.getMonth() + 1),
                    day: date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate(),
                    minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                };
                delete doc._id;

                doc.name = reprint_to.name;
                doc.head = reprint_to.head;
                doc.time = time;
                doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title;
                doc.comments = [];
                doc.reprint_info = {"reprint_from": reprint_from};
                doc.pv = 0;

                //更新被转载的原文档的 reprint_info 内的 reprint_to
                collection.update({
                    "_id": new ObjectID(reprint_from._id)
                }, {
                    $push: {
                        "reprint_info.reprint_to": {
                            "name": doc.name,
                            "day": time.day,
                            "title": doc.title
                        }
                    }
                }, function (err) {
                    if (err) {
                        pool.release(mongodb);;
                        return callback(err);
                    }
                });

                //将转载生成的副本修改后存入数据库，并返回存储后的文档
                collection.insert(doc, {
                    safe: true
                }, function (err, post) {
                    pool.release(mongodb);;
                    if (err) {
                        return callback(err);
                    }
                    callback(err, post.ops[0]);
                });
            });
        });
    });
}