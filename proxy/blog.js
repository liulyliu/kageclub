var models = require('../models');
var Blog = models.Blog;
var utility = require('utility');




exports.getOne = function (obj,callback) {
    Blog.findOne(obj, callback);
}

exports.getWithRange = function(obj,range,callback){
    Blog.find(obj).skip(range[0]).limit(range[1]).exec(callback);
}

exports.get = function(obj,callback){
    Blog.find(obj, callback);
}

exports.getByKey = function(key,callback){
    var reg = new RegExp(key);
    Blog.find({$or:[{title : reg},{content:reg},{ tags:{$all:[key]}}]},callback);
}


exports.newAndSave = function (data,callback) {
  var blog = new Blog();
  blog.title = data.title;
  blog.content = data.content;
  blog.author_id = data.author_id;
  blog.tags  = data.tags || [];
  blog.cate_id = data.cate_id;
  blog.thumb = data.thumb || '';
  blog.theme = data.theme || 'default'
  blog.save(callback);
};
