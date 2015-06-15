var BlogUsers = require('../models').BlogUsers;
var utility = require('utility');
exports.getBlogUser = function(author_id, callback) {
    BlogUsers.findOne({
        author_id: author_id
    }, callback);
};

exports.getBlogById = function(blog_id,callback) {
    BlogUsers.findOne({
        _id : blog_id
    },callback);
};

exports.newAndSave = function(data, callback) {
    var blog_users = new BlogUsers();
    blog_users.blogname = data.blogname;
    blog_users.author_id = data.author_id;
    blog_users.blogstat = data.blogstat;
    blog_users.save(callback);
};
