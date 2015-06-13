var BlogUsers = require('../models').BlogUsers;
var utility = require('utility');
exports.getBlogUser = function(author_id, callback) {
    BlogUsers.findOne({
        author_id: author_id
    }, callback);
};

exports.newAndSave = function(data, callback) {
    var blog_cate = new BlogUsers();
    blog_cate.catename = utility.trim(data.catename);
    blog_cate.author_id = data.author_id;
    blog_cate.save(callback);
};
