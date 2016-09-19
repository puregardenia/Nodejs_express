/**
 * Created by Administrator on 2016/9/19.
 */

//使用 iconv-lite
//var request = require('request');
//var cheerio = require('cheerio');
//var iconv = require('iconv-lite');
//
//request({
//    url: 'http://www.taobao.com/',
//    // 重点，设置 request 抓取网页时不要对接收到的数据做任何转换
//    encoding: null
//}, function (err, res, body) {
//    if (err) throw err;
//
//    // 转换 gbk 编码的网页内容
//    body = iconv.decode(body, 'gbk');
//
//    var $ = cheerio.load(body);
//
//    // 输出网页的标题
//    console.log($('head title').text());
//});


//使用 GBK 模块
var cheerio = require('cheerio');
var gbk = require('gbk');

gbk.fetch('http://www.lmlq.com/', 'utf-8').to('string', function (err, body) {
    if (err) throw err;

    var $ = cheerio.load(body);

    // 输出网页标题
    console.log($('head title').text());
});