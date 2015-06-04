var models = require('../models');
var Thumbtags = models.Thumbtags;
var utility = require('utility');
var uuid = require('node-uuid');
exports.getOne = function (obj,callback) {
    Thumbtags.findOne(obj, callback);
}
exports.newAndSave = function (data,callback) {
  var thumbtags = new Thumbtags();
  thumbtags.tag = data.tag;
  thumbtags.hits = data.hits || 0
  thumbtags.save(callback);
};
