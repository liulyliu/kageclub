var validator = require('validator');

var at = require('../common/at');
var Blog = require('../proxy').Blog;
var BlogCate = require('../proxy').BlogCate;
var BlogUsers = require('../proxy').BlogUsers;
var User = require('../proxy').User;
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var store = require('../common/store');
var config = require('../config');
var _ = require('lodash');
var cache = require('../common/cache');


var ep = new EventProxy();


function BlogController(config) {
    var blogMaster, list, visitor;

    this.config = config || {
        enable: false,
        name: '博客',
        maxCache: 1000
    };

    //this.evt = EventProxy.create(['setBlogMaster', 'setList', 'actionBLog', ''], function() {});
    var _this = this;
    ep.on('setBlogMaster', function() {
        if (_this.__done) {
            _this.__done.apply(_this, arguments);
        }
    })
    this.getBlogMaster = function() {
        return blogMaster;
    };

    this.setBlogMaster = function(newUser) {
        if (typeof newUser == 'string') {
            var blog_id = newUser;
            var _this =this;
            blogMaster = BlogController.staticMethods.cache[blog_id];
            if (blogMaster) {
                ep.emit('setBlogMaster');
            } else {
                BlogUsers.getBlogById(newUser, function(err, blogUser) {
                    if (err) {
                        ep.emit('setBlogMaster', err);
                        return;
                    }
                    if (blogUser) {
                        User.getUserById(blogUser.author_id, function(err, user) {
                            if (user) {
                                user.blogUser = blogUser;
                                BlogController.staticMethods.cache[blog_id] = user;
                                BlogController.staticMethods.currCache.push(blog_id);
                                if (_this.config.maxCache < BlogController.staticMethods.currCache.length) {
                                    delete BlogController.staticMethods.cache[BlogController.staticMethods.currCache[0]];
                                    BlogController.staticMethods.currCache.shift();
                                }
                                blogMaster = user;
                                ep.emit('setBlogMaster');
                            } else {
                                ep.emit('setBlogMaster', err);
                            }
                        });
                    } else {
                        ep.emit('setBlogMaster', err)
                    }
                })
            };
        } else {
            blogMaster = newUser;
            ep.emit('setBlogMaster');
        }
    }
    this.setVisiter = function(newUser) {
            visitor = newUser;
    };

    this.getVisitor = function() {
        return visitor;
    }
}
BlogController.prototype.done = function(func) {
    this.__done = func || function() {};
}

BlogController.staticMethods = {
    cache: {},
    currCache: []
};

BlogController.prototype.init = function() {

};

BlogController.prototype.getCateList = function(callback, isVisitor) {
    var user = isVisitor ? this.getVisitor() : this.getBlogMaster(),
        _this = this;
    BlogCate.getBlogCatesByAuthor_id(user._id, function(err, cates) {
        callback && callback.apply(_this, [err, cates])
    });
}


BlogController.prototype.getBlogs = function(range, callback) { //获取博文
    var range = range || [0, this.config.pageSize || 10];
    var _this = this;
    var blogMaster = this.getBlogMaster();
    if (blogMaster) {
        Blog.getWithRange({
            author_id: blogMaster._id
        }, range, function(err, blog) {
            callback && callback.apply(_this, arguments)
        });
    } else {
        callback && callback({
            err: 'no master'
        })
    }
};

BlogController.prototype.putActive = function(data, callback) { //激活接口
    var _this = this;
    var author = this.getVisitor();
    var error;
    var blogname = validator.trim(data.blogname);
    if (blogname === '') {
        error = this.config.name + '名称不能为空';
    }
    if (error) {
        callback && callback.call(_this, error);
        return;
    }
    this.getBlogUser(function(err, blogUser) {
        var _this = this;
        if (blogUser) {
            blogUser.blogstat = 1;
            blogUser.laststat_at = new Date();
            blogUser.save(function(err) {
                callback && callback.call(_this, err);
            });
        } else {
            BlogUsers.newAndSave({
                blogname: blogname,
                author_id: author._id,
                blogstat: 1
            }, function(err) {
                callback && callback.call(_this, err);
            });


        }
    });

};

BlogController.prototype.create = function(data, callback) {
    var _this = this;
    var title = validator.trim(data.title);
    title = validator.escape(title);
    var tags = validator.trim(data.tags).split(',');
    var content = validator.trim(data.content);
    var theme = validator.trim(data.theme) || 'default';
    var author = this.getVisitor();
    // 验证
    var editError;
    if (!this.hasBlog()) {
        editError = '帐号错误，请确认是否开通了' + this.config.name + '。';
    } else if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 1 || title.length > 100) {
        editError = '标题字数太多或太少。';
    } else if (content === '') {
        editError = '内容不可为空';
    }
    // END 验证

    if (editError) {
        callback && callback.call(_this, editError);
    } else {
        Blog.newAndSave({
            title: title,
            tags: tags,
            content: content,
            theme: theme,
            author_id: author._id
        }, function(err) {
            callback && callback.call(_this, err);
        });
    }
}

exports.blog = new BlogController(config.blog);
