var Thumb = require('../proxy').Thumb;
var utility = require('utility');
var fs = require('fs');
var config = require('../config');
var request = require('request');
var locale = 'http://' + config.host;


function getArrsFromArr(arr,num) {
    if(arr.length <= num) {
        return arr;
    }
    var numObj = {};
    var res = [];
    for(var i=0; i<num; i++) {
        var k = getRandom();
        res.push(arr[k]); 
    }

    function getRandom() {
       var random = parseInt(Math.random() * (arr.length - 1));
       if(numObj[random]) {
            return getRandom();
       } else {
        numObj[random] = 1;
        return random;
       }
    }

    return res;

}


exports.index = function(req, res, next) {
    Thumb.get({}, function(err, thumbs) {
        
        var result = getArrsFromArr(thumbs,60);
        res.render('thumb', {
            thumbs: result
        });
    });
}

exports.img240 = function(req, res, next) {
    var name = req.params.name;
    Thumb.getOne({
        url: '/thumbs/' + name
    }, function(err, thumb) {
        if (thumb) {
            var pname = thumb.source.split('.');
            request.get(locale + '/thumb/' + thumb.path + '240_'+name + '.' + pname[pname.length-1])
                .on('response', function(response) {
                    res.set(response.headers);
                })
                .on('error', function(err) {
                    console.error(err);
                })
                .pipe(res);
        }
    });

}

exports.img = function(req, res, next) {
    var name = req.params.name;
    Thumb.getOne({
        url: '/thumbs/' + name
    }, function(err, thumb) {
        if (thumb) {
            var pname = thumb.source.split('.');
            //request.get('http://images.17173.com/2015/acg/2015/06/04/output/gq0604qq02.jpg')
            request.get(locale + '/thumb/' + thumb.path + name +  '.' + pname[pname.length-1])
                .on('response', function(response) {
                    thumb.hits++;
                    thumb.save();
                    res.set(response.headers);
                })
                .on('error', function(err) {
                    console.error(err);
                })
                .pipe(res);
        }
    });

}
