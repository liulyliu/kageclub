var Blog = require('../models').Blog;
var utility = require('utility');
exports.getBlogByUserId = function(author_id, callback) {
    Blog.findOne({
        author_id: author_id
    }, callback);
};

exports.getBlogById = function(blog_id,callback) {
    Blog.findOne({
        _id : blog_id
    },callback);
};

exports.newAndSave = function(data, callback) {
    var blog = new Blog();
    blog.blogname = data.blogname;
    blog.author_id = data.author_id;
    blog.blogstat = data.blogstat;
    blog.save(callback);
};
