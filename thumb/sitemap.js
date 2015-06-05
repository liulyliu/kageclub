var cheerio = require('cheerio');
var superagent = require('superagent');
exports.sources = [{
    id : 'photo178com',
    host: 'photo.178.com',
    url: 'http://photo.178.com/index/search/ajax/1/hash/0.9454022927675396/page/{page}/?name={key}',
    spider: function(res, get) {
        var arr = eval('(' + res.text + ')');
        var i = 0,
            errs = [],
            reg = /pic\d{0,2}\.178\.com\/\d+\/\d+\/month_\d+\/.+$/,
            result = [];
            if(!arr || arr.length ==0) {
                get.exit('photo178com');
                return;
            }
        function callerSpider(i) {
            if (!arr[i]) {
                get.next('photo178com') ;               
                return;
            }
            superagent.get('http://photo.178.com/view/id/' + arr[i].id).end(function(err, res) {
                if (err) {
                    errs.push(arr[i].id);
                    callerSpider(++i);
                } else {
                    var info = {};
                    $ = cheerio.load(res.text);
                    if($('.ad-thumb-list img').length == 0) {
                        callerSpider(++i);
                    }
                    info.group = $('.img-title h2')[0].children[0].data;
                    info.group_desc = info.group;
                    var list =  $('.ad-thumb-list img');
                    var l = 0;
                    getList(0);
                    function getList(l){
                        var img = list.eq(l);
                        if(!img || !img[0]) {
                            callerSpider(++i);
                            return;
                        } else {
                            img = img[0];
                        }
                        if (reg.test(img.attribs.src)) {
                            info.title = '';
                            info.url = img.attribs.src.replace(/\d+_/,'');
                            get(info,function(){
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

}];


exports.keys = ['初音', 'miku', 'hatsune', '初音未来','colsplay'];
