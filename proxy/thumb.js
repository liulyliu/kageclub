var models = require('../models');
var Thumb = models.Thumb;
var utility = require('utility');




exports.getOne = function (obj,callback) {
    Thumb.findOne(obj, callback);
}

exports.get = function(obj,callback){
    Thumb.find(obj, callback);
}


exports.newAndSave = function (data,callback) {
  var thumb = new Thumb();
  thumb.name = utility.md5(data.url);
  thumb.title = data.title || '';
  thumb.url = data.url;
  thumb.url2 = data.url2 || data.url;
  thumb.tags = data.tags || [];
  thumb.source = data.source;
  thumb.path = data.path || './';
  thumb.group = data.group || 'default';
  thumb.group_desc = data.group_desc || '';
  thumb.hits = data.hits || 0
  thumb.save(callback);
};
