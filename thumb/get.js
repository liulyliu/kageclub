var config = require('../config');
var pro = require('process');
var utility = require('utility');
var fs = require('fs');
var exec = require('exec');
var Thumb = require('../proxy').Thumb;
var Thumbtags = require('../proxy').Thumbtags;
var gm = require('gm');
var imagemagick = gm.subClass({
    imageMagick: true
});

function get(datas, callback) {
    var succ = 0,fail = 0;
    function getByIdx(idx) {
        
        if (idx >= datas.length) {
            callback && callback();
            return;
        }
        var data = datas[idx];

        wgetImage(data.source, function(wgetRes, wgetErr) {
            //console.log('wget ' + data.source + '成功返回');
            console.log('当前正在处理第' + (idx+1) +'张图片，共'+ datas.length + '张,失败'+ fail + '张');
            data.url = '/thumbs/' + wgetRes.name;
            
            resizeImage({
                path: wgetRes.path,
                dstName: '240_' + wgetRes.fileName,
                srcName: wgetRes.fileName,
                resize: 240
            }, function(resizeRes, resizeErr) {
                if (!resizeErr) {
                    //console.log('压缩' + resizeRes.path + resizeRes.dstName + '成功');
                    data.url2 = '/thumbs/w240/' + wgetRes.name;
                    data.name = wgetRes.name;
                    data.path = wgetRes.depath

                    saveData(data, function(saveRes, saveErr) {
                        getByIdx(++idx);
                    });
                } else {
                    console.log('压缩' + resizeRes.path + resizeRes.dstName + '失败');
                    fail++;
                    getByIdx(++idx);
                }

            });
        });
    }

    getByIdx(0);


    function wgetImage(url, callback) {
        //var url = 'http://i2.17173cdn.com/i7mz64/YWxqaGBf/tu17173com/20150417/ccFNwPbjtdqvnqd.jpg!a-5-1920x1080.jpg';
        var host = url.replace(/(http:\/\/|https:\/\/)([^\/]+)(.*)$/, '$2'),
            name = utility.md5(url),
            ext = url.replace(/^(.*)(\.[a-zA-Z]+$)/, '$2'),
            depath = '/' + host + '/',
            path = __dirname + depath;

        if (fs.existsSync(host)) {
            go();
        } else {
            fs.mkdir(host, function() {
                go();
            });

        }

        function go() {
            var file = path + name + ext;
            var fileExist = fs.existsSync(file);
            var wgetRes = {
                path: path,
                ext: ext,
                name: name,
                fileName: name + ext,
                host: host,
                depath: depath
            };

            var cmd = 'wget -O ' + file + ' ' + url;
            if (fs.existsSync(file)) {
                callback && callback(wgetRes, 'exist');
                return;
            }

            exec(cmd, function(err) {
                callback && callback(wgetRes, err);
            });
        }

    }


    function resizeImage(params, callback) {
        imagemagick(params.path + params.srcName).resize(params.resize).autoOrient().write(params.path + params.dstName, function(err) {
            callback && callback(params, err);
        });
    }

    function saveData(data, callback) {
        Thumb.getOne({
            source: data.source
        }, function(err, thumb) {
            if (err || thumb) {
                if(err) {
                    console.log(data.source + '并没有存入数据库');
                    fail++;
                }
                callback && callback();
            } else {

                Thumb.newAndSave(data, function(err) {
                    if (err) {
                        console.log(data.source + '存入数据库失败');
                        fail++;
                    } else {
                        //console.log(data.source + '存入数据库成功');
                    }
                    callback && callback(data, err);
                });
            }
        });

    }

    function _re(arr) {
        var obj = new Object(null),
            newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) {
                newArr.push(arr[i]);
                obj[arr[i]] = 1;
            }
        }
        return newArr;
    }

}

exports.get = get;
