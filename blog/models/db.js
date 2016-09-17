var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

//generic-pool 数据库连接池模式
module.exports = function() {
    return new Db(
        settings.db,
        new Server(settings.host, settings.port),
        {safe: true, poolSize: 1}
    );
};


// 普通模式
//module.exports = new Db(
//    settings.db,
//    new Server(settings.host, settings.port),
//    {safe: true}
//);