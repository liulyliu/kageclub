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

        function callerSpider(i) {
            if (!arr[i]) {
                get.exit('photo178com') ;               
                return;
            }
            superagent.get('http://photo.178.com/view/id/' + arr[i].id).end(function(err, res) {
                if (err) {
                    errs.push(arr[i].id);
                } else {
                    var info = {};

                    $ = cheerio.load(res.text);

                    info.group = $('.img-title h2')[0].children[0].data;
                    info.group_desc = info.group;

                    $('.ad-thumb-list img').each(function(i, img) {
                        if (reg.test(img.attribs.src)) {
                            info.title = '';
                            info.url = img.attribs.src.replace(/\d+_/,'');
                            get(info);
                        }
                    });
                    callerSpider(++i);
                }
            });
        }

        callerSpider(i);

    }

}];


exports.keys = ['初音', 'miku', 'hatsune', '初音未来','colsplay','col','动漫'];
