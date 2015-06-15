var mongoose = require('mongoose');
var BUModel = mongoose.model('BlogUsers');
var config = require('../config')

//验证是否启用博客功能


exports.enableRequired = function(req, res, next) {
    var blog = req.blog;
    if (!blog.config.enable) {
        return res.render('notify/notify', {
            error: '站点关闭了' + req.blog.config.name + '功能'
        });
    }
    var blog_id = req.params.blog_id;
    blog.done(function(){
        next();
    });
    //初始化blog
    blog.setVisiter(req.session.user);
    if(blog_id) {
        blog.setBlogMaster(blog_id);
    } else {
        blog.setBlogMaster(req.session.user)
    }
    
}


//验证是博客状态

exports.authBlogStat = function(req, res, next) {
    var stat = getStat(req.session.user, req.blog);
    if (stat.code == 1) {

        next();
    } else {
        if (stat.code == -1) {

            res.redirect('/blog/active');
            return;
        }
        return res.render('notify/notify', {
            error: '您的' + stat.msg
        });
    }
}

//验证博主信息
exports.authBlogMaster = function(req, res, next) {
    var blogMaster = req.blog.getBlogMaster();
    if(!blogMaster) {
       return res.status(404).send('not found page!'); 
    }
    var stat = getStat(blogMaster, req.blog);
    if (stat.code == 1) {
        next();
    } else {
        return res.render('notify/notify', {
            error: '该用户' + stat.msg
        });
    }
}


function getStat(blogUser, blog) {
    var blogName = blog.config.name,
        code;

    if (blog.config.adminOnly && !config.admins.hasOwnProperty(blogUser.loginname)) {
        code = -999
    } else {
        if (!blogUser) {
            code = -1;
        } else {
            code = blogUser.blogUser.blogstat;
        }
    }

    var stat = {
        '-999': blogName + '不能访问，因为' + blogName + '暂时只对管理员开放',
        '-1': blogName + '未开通',
        '-2': blogName + '开通申请被驳回',
        '-3': blogName + '被管理员封禁，请等待解封',
        '0': blogName + '正在申请中，请耐心等待',
        '1': ''
    };
    return {
        code: code,
        msg: stat[code]
    }

}
