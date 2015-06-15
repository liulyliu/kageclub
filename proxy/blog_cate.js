var BlogCate = require('../models').BlogCate;
var utility = require('utility');
exports.getBlogCate = function (author_id, blog_id, callback) {
  BlogCate.findOne({author_id: author_id, blog_id: blog_id}, callback);
};

exports.getBlogCatesByAuthor_id = function (author_id, callback) {
  BlogCate.find({author_id: author_id}, callback);
};

exports.newAndSave = function (data, callback) {
  var blog_cate = new BlogCate();
  blog_cate.catename = data.catename;
  blog_cate.author_id = data.author_id;
  blog_cate.save(callback);
};

exports.remove = function (data, callback) {
  BlogCate.remove(data, callback);
};

