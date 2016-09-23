var libuvThreadCC = require('../build/Release/uv_thread.node').libuvThreadCC;
//这边libuvThreadCC是加载C++暴露给js调用的接口，后面会讲到，先不理会它
module.exports = function(work, arg, cb){
    //进行合法性判断
    if('function' !== typeof work) throw('argument[0] must be a function');
    if('object' !== typeof arg) throw('argument[1] must be an object');
    cb = cb || function(){};
    arg = JSON.stringify(arg);//字符串化传入参数
    work = '('+work.toString()+')('+arg+')';//拼接工作函数
    libuvThreadCC(work,cb);//工作函数和回调函数丢入C++方法中执行
}