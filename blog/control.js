var validator = require('validator');
var Blog = require('../proxy').Blog;
var BlogCate = require('../proxy').BlogCate;
var BlogArticle = require('../proxy').BlogArticle;
var User = require('../proxy').User;
var EventProxy = require('eventproxy');
var config = require('../config');


var ep = new EventProxy();


function BlogController(config) {
    var blogMaster, list, visitor;

    this.config = config || {
        enable: false,
        name: '博客',
        maxCache: 1000
    };

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
            var _this = this;
            blogMaster = BlogController.staticMethods.cache[blog_id];
            if (blogMaster) {
                ep.emit('setBlogMaster');
            } else {
                Blog.getBlogById(newUser, function(err, blog) {
                    if (err) {
                        ep.emit('setBlogMaster', err);
                        return;
                    }
                    if (blog) {
                        User.getUserById(blog.author_id, function(err, user) {
                            if (user) {
                                user.blog = blog;
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
            if (blogMaster.blog === undefined) {
                blog.getBlogByUserId(blogMaster._id, function(err, blog) {
                    if (err) {
                        ep.emit('setBlogMaster', err);
                        return;
                    } else {
                        blogMaster.blog = blog;
                        ep.emit('setBlogMaster', err);
                    }
                });
            } else {
                ep.emit('setBlogMaster');
            }

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


BlogController.prototype.getCateList = function(callback, isVisitor) {
    var user = isVisitor ? this.getVisitor() : this.getBlogMaster(),
        _this = this;
    BlogCate.getBlogCatesByAuthor_id(user._id, function(err, cates) {
        callback && callback.apply(_this, [err, cates])
    });
}





BlogController.prototype.getArticles = function(range, callback) { //获取博文
    var range = range || [0, this.config.pageSize || 10];
    var _this = this;
    var blogMaster = this.getBlogMaster();
    BlogArticle.getWithRange({
        author_id: blogMaster._id
    }, range, function(err, blogArticle) {
        callback && callback.apply(_this, arguments)
    });
};


BlogController.prototype.getArticleById = function(article_id,callback) {
    var _this = this;
    BlogArticle.getArticleById(article_id,callback);
}

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
    var _this = this,
        blog = author.blog;
    if (blog) {
        blog.blogstat = 1;
        blog.laststat_at = new Date();
        blog.save(function(err) {
            callback && callback.call(_this, err);
        });
    } else {
        Blog.newAndSave({
            blogname: blogname,
            author_id: author._id,
            blogstat: 1
        }, function(err) {
            callback && callback.call(_this, err);
        });


    }

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
    if (title === '') {
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
        BlogArticle.newAndSave({
            title: title,
            tags: tags,
            content: content,
            theme: theme,
            author_id: author._id
        }, function(err,article) {
            callback && callback.apply(_this, arguments);
        });
    }
};


BlogController.prototype.cateCreate =  function(data,callback){
    var catename = validator.trim(data.catename);
    var cateErr;
    var _this =this;
    if(catename === '') {
       cateErr = '分类名称不能为空' 
    } else if (caetname.length >20) {
        cateErr = '分类名称太长了'
    }
    if(cateErr) {
       return callback && callback.call(_this,cateErr); 
    }
    var visitor = _this.getVisitor();
    BlogCate.newAndSave({
        author_id : visitor._id,
        catename : catename
    },function(err,cate){
       callback && callback.call(_this,arguments); 
    });
},


exports.blog = new BlogController(config.blog);
