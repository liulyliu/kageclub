var sitemap = require('./sitemap');
var get = require('./get').get;


var sources = sitemap.sources;

function run(idx) {
    var source = sources[idx];
    if(!source) {
        console.log('全部完成');
        return;
    }
    if(source.disabled) {
        run(++idx);
        return;
    }
    console.log('开始解析' + source.url);
    source.spider(function(dataList){
        if(idx >= sources.length) {
            console.log('下载全部完成');
            return;
        }
        get(dataList,function(){
            run(++idx);
        });
    });
}

run(0);
