var cheerio = require('cheerio');
var superagent = require('superagent');
var pro = require('process');


function spider_acg17173comillusin(url) {
    return function(get) {
        superagent.get(url).end(function(err, res) {
            if (!err) {
                console.log(url + ' 成功返回结果');
                var $ = cheerio.load(res.text);
                var urllist = [];
                var dataList = [];
                var hasUrl = {};
                var $doms = $('div.comm-pn ul.comm-plist3 li.item a');
                $doms.each(function(i, o) {
                    var listUrl = o.attribs.href.split('_');
                    listUrl = listUrl[0] + '_all.shtml';
                    urllist.push(listUrl);
                });
                console.log('得到地址列表' + urllist.length + '个！,开始解析...');
                callerSpider(0);

                function callerSpider(i) {
                    if (!urllist[i]) {
                        console.log('得到结果数：' + dataList.length);
                        get(dataList);
                        return;
                    }
                    var listUrl = urllist[i];

                    superagent.get(listUrl).end(function(err, res) {
                        if (!err) {
                            console.log(listUrl + '成功返回结果');
                            var $$ = cheerio.load(res.text);
                            var nums = 0;
                            var domsList = $$('#mod_article p a[href^="http://news.17173.com/viewpic.htm?url="]');

                            domsList.each(function(idx, dom) {

                                if (!dom.attribs.href.indexOf('http://news.17173.com/viewpic.htm?url=') >= 0) {
                                    var info = {};
                                    info.group = $$('div.gb-final-pn-article h1.gb-final-tit-article')[0].children[0].data
                                    info.group_desc = $$('#mod_article p')[0].children[0].data;
                                    info.source = dom.attribs.href.replace('http://news.17173.com/viewpic.htm?url=', '');
                                    var tag = [];
                                    if (dom.children[0]) {
                                        tag = dom.children[0].attribs.alt ? dom.children[0].attribs.alt.split(',') : [];
                                    }
                                    info.tags = tag ? [tag] : [];
                                    info.title = info.group;
                                    if (!hasUrl[escape(info.source)]) {
                                        dataList.push(info);
                                        hasUrl[escape(info.source)] = 1;
                                    } else {
                                        console.info(info.url)
                                    }
                                    nums++;
                                }
                            });

                            console.log('得到图片地址' + nums + '个');
                            callerSpider(++i);
                        } else {
                            console.info(listUrl + '返回失败');
                            urllist.push(listUrl) //放到最后，再取一次
                            callerSpider(++i);
                        }

                    })
                };
            }

        });
    }



}



exports.sources = [{
    //disabled :true,
    id: 'acg17173comillusion',
    host: 'acg.17173.com',
    noKey: true,
    url: 'http://acg.17173.com/illusion/index.shtml',
    spider:spider_acg17173comillusin('http://acg.17173.com/illusion/index.shtml')

}, {
    //disabled :true,
    id: 'acg17173comillusion',
    host: 'acg.17173.com',
    noKey: true,
    url: 'http://acg.17173.com/illusion/index_1.shtml',
    spider:spider_acg17173comillusin('http://acg.17173.com/illusion/index_1.shtml')

},{
    //disabled :true,
    id: 'acg17173comillusion',
    host: 'acg.17173.com',
    noKey: true,
    url: 'http://acg.17173.com/illusion/index_2.shtml',
    spider:spider_acg17173comillusin('http://acg.17173.com/illusion/index_2.shtml')

}];

var _sources = [{
        id: 'photo178com',

        disabled: true,
        host: 'photo.178.com',
        url: 'http://photo.178.com/index/search/ajax/1/hash/0.9454022927675396/page/{page}/?name={key}',
        spider: function(res, get) {
            var arr = eval('(' + res.text + ')');
            var i = 0,
                errs = [],
                reg = /pic\d{0,2}\.178\.com\/\d+\/\d+\/month_\d+\/.+$/,
                result = [];
            if (!arr || arr.length == 0) {
                return;
            }

            function callerSpider(i) {
                if (!arr[i]) {
                    get.next('photo178com');
                    return;
                }
                superagent.get('http://photo.178.com/view/id/' + arr[i].id).end(function(err, res) {
                    if (err) {
                        errs.push(arr[i].id);
                        callerSpider(++i);
                    } else {
                        var info = {};
                        $ = cheerio.load(res.text);
                        if ($('.ad-thumb-list img').length == 0) {
                            callerSpider(++i);
                        }
                        info.group = $('.img-title h2')[0].children[0].data;
                        info.group_desc = info.group;
                        var list = $('.ad-thumb-list img');
                        var l = 0;
                        getList(0);

                        function getList(l) {
                            var img = list.eq(l);
                            if (!img || !img[0]) {
                                callerSpider(++i);
                                return;
                            } else {
                                img = img[0];
                            }
                            if (reg.test(img.attribs.src)) {
                                info.title = '';
                                info.url = img.attribs.src.replace(/\d+_/, '');
                                get(info, function() {
                                    getList(++l);
                                });
                            } else {
                                getList(++l)
                            }
                        }

                    }
                });
            }

            callerSpider(i);

        }

    },

    {
        id: 'tuxiaopicom',
        disabled: true,
        host: 'tu.xiaopi.com',
        url: 'http://tu.xiaopi.com/index.php?m=catlist&c=index&a=init&catid=4&page={page}',
        noKey: true,
        spider: function(res, get) {
            var arr = JSON.parse(res.text).data;
            if (!arr || arr.length == 0) {
                console.info('over');
                pro.exit();
                return;
            }

            function add0(n) {
                if (n < 10) {
                    return '0' + n
                } else {
                    return n;
                }
            };

            function callerSpider(i) {
                if (!arr[i]) {
                    get.exit('tuxiaopicom');
                    return;
                }
                var curr = arr[i];

                var info = {};
                var baseUrl = curr.thumb.replace('fm01.jpg', '');
                info.group = curr.title;
                info.group_desc = curr.title;
                var getList = function(l) {
                    var url = baseUrl + add0(l) + '.jpg';
                    superagent.get(url).end(function(err, res) {
                        if (err && err.status == 404) {
                            callerSpider(++i);
                        } else {
                            info.url = url;
                            get(info, function() {
                                getList(++l);
                            });
                        }
                    })

                }
                getList(1);
            }
            callerSpider(0);
        }
    }
]
exports.keys = ['穹妹', '刀剑', '', '初音', 'cos+黑丝', 'cos+美女', '吾王'];
