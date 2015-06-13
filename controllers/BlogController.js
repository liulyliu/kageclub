var validator = require('validator');

var at = require('../common/at');
var Blog = require('../proxy').Blog;
var BlogCate = require('../proxy').BlogCate;
var BlogUsers = require('../proxy').BlogUsers;
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var store = require('../common/store');
var config = require('../config');
var _ = require('lodash');
var cache = require('../common/cache');


function BlogController(config) {
    var blogMaster, list,visitor;

    this.config = config || {
        active: false,
        blogName : '博客'
    };

    //this.evt = EventProxy.create(['setBlogMaster', 'setList', 'actionBLog', ''], function() {});
    this.getBlogMaster = function() {
        return blogMaster;
    };

    this.setBlogMaster = function(newUser) {
            blogMaster = newUser;
    }
    this.setVisiter = function(newUser){
        visitor = newUser;    
    };

    this.getVisitor = function(){
        return visitor;
    }
}

BlogController.staticMethods = {};

BlogController.prototype.init = function() {

};

BlogController.prototype.getCateList = function(callback,isVisitor){
    var user = isVisitor ?  this.getVisitor() : this.getBlogMaster(),
    _this = this;
    BlogCate.getBlogCatesByAuthor_id(user._id,function(err,cates){
        callback && callback.apply(_this,[err,cates]) 
    });
}


BlogController.prototype.getBlogs = function(range) {
    var range = range || [0, this.config.pageSize || 10];
    var blogMaster = this.getBlogMaster();
    if (blogMaster) {
        Blog.getWithRange({
            author_id: blogMaster._id
        }, range, function(err, blog) {

        });
    }
};

BlogController.prototype.putActive = function(data,callback){
    var _this = this;
    var author = this.getVisitor();
    var error;
    var blogname = validator.trim(data.blogname);
    if(blogname === '') {
        error = this.config.blogName + '名称不能为空';
    }
    if(error) {
        callback && callback.call(_this,error);
        return;
    }
    BlogUsers.newAndSave({
        blogname : ,
    },function(err){
        callback && callback.call(_this,err);
    });
};

BlogController.prototype.create = function(data,callback) {
    var _this = this;
    var title = validator.trim(data.title);
    title = validator.escape(title);
    var tags = validator.trim(data.tags).split(',');
    var content = validator.trim(data.content);
    var theme = validator.trim(data.theme) || 'default';
    var author = this.getVisitor(); 
    // 验证
    var editError;
    if(!this.hasBlog()) {
        editError = '帐号错误，请确认是否开通了'+this.config.blogName+'。';
    } else if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 1 || title.length > 100) {
        editError = '标题字数太多或太少。';
    } else if (content === '') {
        editError = '内容不可为空';
    }
    // END 验证

    if (editError) {
        callback && callback.call(_this,editError);
    } else {
        Blog.newAndSave({
            title : title,
            tags : tags,
            content : content,
            theme : theme,
            author_id :author._id
        },function(err){
            callback && callback.call(_this,err);
        }); 
    }
}

BlogController.prototype.hasBlog = function(){
    var author = this.getVisitor();
    if(this.config.adminOnly && !author.is_admin ) {
        return false; 
    }
    console.info(author.hasBlog)
    return author && author.hasBlog;
}

BlogController.prototype.getBlogUser = function(callback){
    if(!this.config.active) {
        return callback && callback.call(_this,[{errCode:'-1',msg : this.config.blogName + '功能未启用'}]);
    }
    var author = this.getVisitor(),_this =this;
    BlogUsers.getBlogUser(author._id,function(err,blogUser){
        callback && callback.apply(_this,[err,blogUser]) ;
    });

}

exports.blog = new BlogController(config.blog);
