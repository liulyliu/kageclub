var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./topic');
require('./reply');
require('./topic_collect');
require('./message');
require('./thumb');
require('./thumbtags');
require('./blog');
require('./blog_cate');
require('./blog_users');

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.Message = mongoose.model('Message');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.Thumb = mongoose.model('Thumb');
exports.Thumbtags = mongoose.model('Thumbtags');
exports.Blog = mongoose.model('Blog');
exports.BlogCate = mongoose.model('BlogCate');
exports.BlogUsers = mongoose.model('BlogUsers');
