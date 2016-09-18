/**
 * Created by Administrator on 2016/9/18.
 */

var request = require('request');

request.post({
    url: 'http://localhost:3000/reply/57de89890769d748c8eca6cb',
    json: {"user": "jack", "content": "你好吗！"}
});

request.post({
    url: 'http://localhost:3000/reply/57de89890769d748c8eca6cb',
    json: {"user": "lucy", "content": "有点无聊！"}
});