var models = require('../models');
var BlogArticle = models.BlogArticle;
var utility = require('utility');




exports.getOne = function (obj,callback) {
    BlogArticle.findOne(obj, callback);
}

exports.getWithRange = function(obj,range,callback){
    BlogArticle.find(obj).skip(range[0]).limit(range[1]).exec(callback);
}

exports.get = function(obj,callback){
    BlogArticle.find(obj, callback);
}

exports.getByKey = function(key,callback){
    var reg = new RegExp(key);
    BlogArticle.find({$or:[{title : reg},{content:reg},{ tags:{$all:[key]}}]},callback);
}


exports.newAndSave = function (data,callback) {
  var blogArticle = new BlogArticle();
  blogArticle.title = data.title;
  blogArticle.content = data.content;
  blogArticle.author_id = data.author_id;
  blogArticle.tags  = data.tags || [];
  blogArticle.cate_id = data.cate_id;
  blogArticle.thumb = data.thumb || '';
  blogArticle.theme = data.theme || 'default'
  blogArticle.save(callback);
};
