var superagent = require('superagent');
var config = require('../config');
var pro = require('process');
var eventproxy = require('eventproxy');
var utility = require('utility');
var fs = require('fs');
var request = require('request');
var fss = require('graceful-fs');
var sitemap = require('./sitemap');
var Thumb = require('../proxy').Thumb;
var Thumbtags = require('../proxy').Thumbtags;


var ps = [];
var currs = {};

function getSourceById(id) {
    for (var s = 0; s < sitemap.sources.length; s++) {
        if (sitemap.sources[s].id == id) {
            return sitemap.sources[s];
        }
    }
}

for (var i = 0; i < sitemap.sources.length; i++) {
    (function(i) {
        var site = sitemap.sources[i];
        currs[site.id] = 0;
        fs.mkdir('./' + site.host, function() {
            var key = sitemap.keys[currs[site.id]];
            go(site, './' + site.host + '/', key);
        });
    })(i)


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

function go(site, path, key) {
    var url = site.url.replace('{page}', '1').replace('{key}', key);
    console.log('get ' + url + '...');
    superagent.get(url).end(function(err, res) {
        if (!err) {

            var get = function(info) {
                var url = info.url;
                var name = utility.md5(url);

                var ext = url.split('.');
                ext = '.' + ext[ext.length - 1];
                Thumb.getOne({
                    source: url
                }, function(err, thumb) {
                    if (err || thumb) {
                        thumb.tags = _re(thumb.tags.push(key));
                        thumb.save();
                    } else {
                        var pname = url.split('\/');
                        var file = path + pname[pname.length - 1];
                        var p = fss.createWriteStream(file);
                        p.on('close', function() {
                            info.tags = info.tags || [];
                            info.tags.push(key);
                            Thumbtags.getOne({
                                tag: key
                            }, function(err, tag) {
                                if (!err && !tag) {
                                    console.info('tags is ' + key)
                                    Thumbtags.newAndSave({
                                        tag: key
                                    });
                                } else {

                                }

                            });
                            Thumb.newAndSave({
                                source: url,
                                name: name,
                                url: '/thumbs/' + name,
                                //url2: '/thumb/' + name + ext,
                                title: info.title,
                                tags: _re(info.tags),
                                group: info.group,
                                path : path,
                                group_desc: info.group

                            }, function(err) {
                                if (err) {
                                    console.log('mongodb err')
                                    return;
                                }

                            })
                            console.info(url + ' to' + '/thumb/' + name + ' saved, tag is\n ')
                            console.dir(_re(info.tags));
                        });

                        p.on('error', function() {
                            console.info('load error');
                        })
                        var r = request(url).pipe(p);
                        r.on('error', function() {
                            console.info('save error');
                        });

                    }

                });



            };
            get.exit = function(id) {
                var site = getSourceById(id);
                var key = sitemap.keys[++currs[site.id]];
                if (key) {
                    go(site, './' + site.host + '/', key);
                } else {
                    console.info('finishing');
                }


            }
            site.spider(res, get);


        } else {
            console.log(site.url + ' get error');
        }

    })
};
