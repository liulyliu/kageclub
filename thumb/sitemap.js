var cheerio = require('cheerio');
var superagent = require('superagent');
var pro = require('process');
exports.sources = [
    {
        id : 'acg17173comillusion',
        host : 'acg.17173.com',
        url : 'http://acg.17173.com/illusion/index(_{page}).shtml',
        spider : function(res){
            var $ = cheerio.load(res.text);
            var urllist = [];
            $()
        
        }
    
    },
    //{
    //    id : 'photo178com',
    //    host: 'photo.178.com',
    //    url: 'http://photo.178.com/index/search/ajax/1/hash/0.9454022927675396/page/{page}/?name={key}',
    //    spider: function(res, get) {
    //        var arr = eval('(' + res.text + ')');
    //        var i = 0,
    //            errs = [],
    //            reg = /pic\d{0,2}\.178\.com\/\d+\/\d+\/month_\d+\/.+$/,
    //            result = [];
    //            if(!arr || arr.length ==0) {
    //                get.exit('photo178com');
    //                return;
    //            }
    //        function callerSpider(i) {
    //            if (!arr[i]) {
    //                get.next('photo178com') ;               
    //                return;
    //            }
    //            superagent.get('http://photo.178.com/view/id/' + arr[i].id).end(function(err, res) {
    //                if (err) {
    //                    errs.push(arr[i].id);
    //                    callerSpider(++i);
    //                } else {
    //                    var info = {};
    //                    $ = cheerio.load(res.text);
    //                    if($('.ad-thumb-list img').length == 0) {
    //                        callerSpider(++i);
    //                    }
    //                    info.group = $('.img-title h2')[0].children[0].data;
    //                    info.group_desc = info.group;
    //                    var list =  $('.ad-thumb-list img');
    //                    var l = 0;
    //                    getList(0);
    //                    function getList(l){
    //                        var img = list.eq(l);
    //                        if(!img || !img[0]) {
    //                            callerSpider(++i);
    //                            return;
    //                        } else {
    //                            img = img[0];
    //                        }
    //                        if (reg.test(img.attribs.src)) {
    //                            info.title = '';
    //                            info.url = img.attribs.src.replace(/\d+_/,'');
    //                            get(info,function(){
    //                                getList(++l); 
    //                            });
    //                        } else {
    //                            getList(++l)
    //                        }
    //                    }    
    //                        
    //                }
    //            });
    //        }
    //
    //        callerSpider(i);
    //
    //    }
    //
    //},

    {
        id: 'tuxiaopicom',
        host: 'tu.xiaopi.com',
        url: 'http://tu.xiaopi.com/index.php?m=catlist&c=index&a=init&catid=4&page={page}',
        noKey :true,
        spider: function(res, get) {
            var arr = JSON.parse(res.text).data;
            if (!arr || arr.length == 0) {
                console.info('over');
                pro.exit();
                return;
            }
            function add0(n) {
                if(n < 10) {
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
                    superagent.get(url).end(function(err,res){
                        if(err && err.status == 404) {
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
];


exports.keys = ['初音', 'miku', 'hatsune', '初音未来', 'colsplay'];
