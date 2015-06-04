var models = require('../models');
var Thumb = models.Thumb;
var utility = require('utility');
var uuid = require('node-uuid');
exports.get = function (id) {
    return Thumb.find({ id: { $in: id } });
}
exports.newAndSave = function (data,callback) {
  var thumb = new Thumb();
  thumb.id = utility.md5(data.url);
  thumb.title = data.title || data.url.split('\/')[data.url.split('\/').length-1];
  thumb.url = data.url;
  thumb.url2 = data.url2 || data.url;
  thumb.tags = data.tags ? data.tags.join(' ') : '';
  thumb.source = data.source;
  thumb.group = data.group || 'default';
  thumb.group_desc = data.group_desc || '';
  thumb.create_at = data.create_at;
  thumb.save(callback);
};
