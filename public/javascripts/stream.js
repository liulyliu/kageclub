/*
 * stream plugin
 * author : liuluying
 *
 * */
//TODO:
(function(w, d) {

    var Stream = function(cfgs) {
        var _t = this,

            config = extend({
                containerId: '',
                itemWidth: 240,
                center: true,
                sort: false
            }, cfgs),
            container = d.getElementById(config.containerId);

        if (!container) {
            return;
        }

        /*999*/

        var items = [].slice.call(container.children);
        var loaded = 0;
        if (items.length == 0) {
            return;
        }

        if (config.sort) {
            items.sort(function(a, b) {
                return parseFloat(getStyle(a, 'height')) - parseFloat(getStyle(b, 'height'));
            });
        }
        var itemOffsetWidth = parseFloat(getStyle(items[0], 'padding-left')) +
            parseFloat(getStyle(items[0], 'margin-right')) + parseFloat(getStyle(items[0], 'margin-left')) +
            parseFloat(getStyle(items[0], 'padding-right')) + items[0].offsetWidth - items[0].clientWidth,

            itemOffsetHeight = parseFloat(getStyle(items[0], 'padding-top')) +
            parseFloat(getStyle(items[0], 'margin-bottom')) + parseFloat(getStyle(items[0], 'margin-top')) +
            parseFloat(getStyle(items[0], 'padding-bottom')) + items[0].offsetHeight - items[0].clientHeight,

            columnWidth = itemOffsetWidth + config.itemWidth;



        var columnsData;

        function getColumnsData() {
            var columns = Math.max(1, parseInt(getContainerWidth() / columnWidth)),
                data = [];
            var overflowWidth = getContainerWidth() % columnWidth;
            overOfst = 0;
            if (config.center) {
                overOfst = overflowWidth / 2;
            }
            for (var c = 0; c < columns; c++) {
                data[c] = {
                    height: container.offsetTop,
                    left: container.offsetLeft + (c * columnWidth) + overOfst,
                    index: c,
                    items: []
                }
            }

            return data;
        }

        function itemMapStyle(item) {
            var column = columnsData.sort(function(a, b) {
                return a.height - b.height;
            })[0];
            initLeft = parseFloat(getStyle(item, 'left'));
            initTop = parseFloat(getStyle(item, 'top'));
            cLeft = column.left;
            cTop = column.height;
            column.height += itemOffsetHeight + parseFloat(getStyle(item, 'height'));
            return {
                item: item,
                initLeft: initLeft,
                initTop: initTop,
                pLeft: cLeft - initLeft,
                pTop: cTop - initTop,
                cLeft: cLeft,
                cTop: cTop
            }
        }

        function itemPush(items) {
            container.style.height = columnsData.sort(function(a, b) {
                return b.height - a.height
            })[0].height + 'px';
            if (config.animate) {
                var n = +new Date;
                animate({
                    duration: config.animate.duration,
                    fps: config.animate.fps,
                    func: function(args) {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var f = args.currFrame / args.frames;
                            item.item.style.width = config.itemWidth + 'px';
                            item.item.style.left = item.initLeft + item.pLeft * f + 'px';
                            item.item.style.top = item.initTop + item.pTop * f + 'px';
                        }
                    },
                    callback: function(args) {}
                });
            } else {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    item.item.style.width = config.itemWidth + 'px';
                    item.item.style.left = item.cLeft + 'px';
                    item.item.style.top = item.cTop + 'px';
                }

            }

        }


        function onAllLoad(cb) {
            var images = container.getElementsByTagName('img');
            var len = images.length - 1;
            var curr = 0
            var _this = this;
            for (var img = 0; img < images.length; img++) {
                var imag = images[img];
                if (imag.width > 0 || imag.height > 0) {
                    curr++;
                    if (curr == len) {
                        window.setTimeout(function() {
                            cb.call(_this);
                        }, 200);
                    }
                }
                imag.onload = imag.onerror = function() {
                    curr++;
                    if (curr == len) {
                        window.setTimeout(function() {
                            cb.call(_this);
                        }, 200);
                    }
                }
            }

        }


        function initItems() {
            onAllLoad.call(this, function() {
                columnsData = getColumnsData();
                var cloneItems = items.concat([]);
                var itemStyles = [];
                while (cloneItems.length > 0) {
                    var item = cloneItems.shift();
                    if (!item.hasLoaded) {
                        item.hasLoaded = true;
                        item.style.position = 'absolute';
                        item.style.left = columnsData[0].left + 'px';
                        item.style.top = columnsData[0].height + 'px';
                    }
                    itemStyles.push(itemMapStyle(item));
                }

                itemPush(itemStyles);

                cloneItems = null;

            })


        };

        function getContainerWidth() {
            return container.offsetWidth - (parseFloat(getStyle(container, 'padding-left')) +
                parseFloat(getStyle(container, 'padding-right')) + container.offsetWidth - container.clientWidth);
        }

        function addItem(list) {
            var i = 0;
            for (; i < list; i++) {
                if ('string' == typeof list[i]) {
                    container.innerHTML += list[i];
                    items.push(container.lastChilend);
                    initItems();
                }
            }

        };
        this.addItem = addItem;

        function delItem(items) {

        };


        function reload() {
            var timer;
            clearTimeout(timer);
            timer = setTimeout(function() {
                initItems();
            }, 1000);
        };

        function __construct() {
            initItems();
            this.reload = reload;

            if (config.resize) {
                window.onresize = reload;
            }

        }
        this.__construct = __construct;

    };

    Stream.prototype = {
        constructor: Stream,
        run: function() {
            if (this.__construct) {
                this.__construct();
            }
        }
    }

    function extend() {
        var args = [].slice.call(arguments);
        for (var i = args.length; i > 0; i--) {
            var item = args[i];
            if (!item) {
                continue;
            }
            for (var k in item) {
                args[i - 1][k] = item[k];
            }

        }
        return args[0];
    }

    function getStyle(el, style) {
        if (!+"\v1") {
            style = style.replace(/\-(\w)/g, function(all, letter) {
                return letter.toUpperCase();
            });
            return el.currentStyle[style];
        } else {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue(style);
        }
    }

    function animate(args) {
        var duration = args.duration || 1000;
        var fps = args.fps || 36;
        var cfg = {
            fps: fps,
            currFrame: 0,
            frames: Math.ceil(duration * fps / 1000)
        };

        if (animate.animating) {
            return;
        }
        animate.animating = true

        var timer = setInterval(function() {
            if (cfg.currFrame >= cfg.frames) {
                clearInterval(timer);
                if ('function' == typeof args.callback) {
                    args.callback(cfg);
                }
                animate.animating = false;
                return;
            }
            cfg.currFrame++;
            args.func(cfg);

        }, 1000 / cfg.fps);


    }
    var stream = new Stream({
        containerId: 'stream-list',
        animate: {
            duration: 300,
            fps: 30
        },
        resize: true
    });
    stream.run();

})(window, document, undefined)
