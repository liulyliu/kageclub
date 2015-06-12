var validator = require('validator');

var at = require('../common/at');
var Blog = require('../proxy').Blog;
var BlogCate = require('../proxy').BlogCate;
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

    this.evt = EventProxy.create(['setBlogMaster', 'setList', 'actionBLog', ''], function() {});


    this.getBlogMaster = function() {
        return blogMaster;
    };

    this.setBlogMaster = function(newUser) {
        if (this.config.login_names && tools.inArray(newUser.loginname, this.config.login_names)) {
            blogMaster = newUser;
            return true;
        } else {
            return false
        }
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
    if(!author._id || tools.inArray(author.loginname,this.config.login_names)) {
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
        console.info('errf')
        callback && callback.call(_this,editError);
    } else {
        Blog.newAndSave({
            title : title,
            tags : tags,
            content : content,
            theme : theme,
            author_id :author._id
        },function(err){
            console.info(err);
            callback && callback.call(_this,err);
        }); 
        
    }

}




exports.blog = new BlogController(config.blog);
