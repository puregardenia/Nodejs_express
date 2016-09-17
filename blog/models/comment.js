/**
 * Created by Administrator on 2016/9/13.
 */

var mongodb = require('./db');
var async = require('async');

function Comment(name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function (callback) {
    var name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;

    async.waterfall([
        function (cb) {
            mongodb.open(function (err, db) {
                cb(err, db);
            });
        },
        function (db, cb) {
            db.collection('posts', function (err, collection) {
                cb(err, collection);
            });
        },
        function (collection, cb) {
            collection.update({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                $push: {"comments": comment}
            }, function (err) {
                cb(err)
            });
        }
    ], function (err) {
        mongodb.close();
        callback(err);
    });

    //mongodb.open(function (err, db) {
    //    if (err) {
    //        return callback(err);
    //    }
    //    db.collection('posts', function (err, collection) {
    //        if (err) {
    //            return callback(err);
    //        }
    //        //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的comment数组里
    //        collection.update({
    //            "name": name,
    //            "time.day": day,
    //            "title": title
    //        },{
    //            $push: {"comments": comment}
    //        }, function (err) {
    //            mongodb.close();
    //            if (err) {
    //                return callback(err);
    //            }
    //            callback(null);
    //        });
    //    });
    //});
}