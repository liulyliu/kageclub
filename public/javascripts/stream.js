var $container = $('#stream-list');



var has = true;
var hasloading = false;
var hasm = false;

function render(page, callback) {
    var size = 30;
    var limit = size * (page - 1);

    var hasloading = true;
    var hasm = false;
    $.get('/thumbs/api?limit=' + limit + ',' + size, function(datas) {
        var list = [];
        var $ul = $('<ul></ul>')
        if (datas.length == 0) {
            has = false;
        }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var html = '<li>' + '<a href="' + data.url + '"><img src="' + data.url2 + '" title="' + data.group + '-' + data.title + '"></a>' + '<span class="thumb-title"> ' + data.title + '</span>' + '<span class="thumb-hits">点击[' + data.hits + ']</span>' + '</li>';
            var newEl = $(html)
            $container.append(newEl)
            list.push(newEl);
            newEl.imagesLoaded(function() {
                if (!hasm) {
                    $container.masonry({
                        gutterWidth: 0,
                        isAnimated: false,
                        itemSelector: 'li'
                    });
                    hasm = true;
                } else {
                    $container.masonry('reload');
                }

                var hasloading = false;
            })
        }




    });
}
var page = 2;
var t;
render(1);
$(window).bind('scroll', function() {
    if (t) {
        window.clearTimeout(t);
    }
    t = window.setTimeout(function() {
        if ($(document).scrollTop() >= $(document).outerHeight() - $(window).outerHeight() -150 && has && !hasloading) {
            render(page++);
        }
    }, 300)
})
