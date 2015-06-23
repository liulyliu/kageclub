var User = require('../proxy').User;
var BlogModel = require('../models').Blog;
var config = require('../config');



exports.active = function(req, res, next) { //开通页
    var blog = req.blog;
    var visitor = blog.getVisitor();
    if (config.blog.adminOnly && !visitor.is_admin) {
        return res.status(403).render('notify/notify', {
            error: '您暂时没有权限请求该资源，请联系管理员'
        });
    }
    if (!visitor.blogUser || visitor.blogUser.blogstat == -1) {
        res.render('blog/active', {
            blogName: blog.config.blogName
        });
    } else {
        res.redirect('/blog')
    }

}


exports.putActive = function(req, res, next) {//开通post
    var body = req.body,
        blog = req.blog,visitor = blog.getVisitor();
    if (config.blog.adminOnly && !visitor.is_admin) {
        return res.status(403).render('notify/notify', {
            error: '您暂时没有权限请求该资源，请联系管理员'
        });
    }
    blog.putActive({
        blogname: body.blog_name
    }, function(err) {
        if (err) {
            return res.render('notify/notify', {
                error: '开通失败了'
            })
        } else {
            res.redirect('/blog');
        }
    })
}



exports.index = function(req, res, next) {//博主页
    var blog = req.blog;
    var blogMaster = req.blog.getBlogMaster();
    blog.getArticles([0, 10], function(err, blogList) {
        res.render('blog/index', {
            user: req.blog.getVisitor() ||{},
            blogMaster: blogMaster,
            blog: blogMaster.blog,
            blogList : blogList || {}
        });
    });
}



exports.modify = function(req,res,next){//修改博客页
    var body = req.body;
    var blog = req.blog.getVisitor().blog;
    blog =  new BlogModel(blog);
    if(body.headpic) {
        blog.headpic = body.headpic; 
    }



    BlogModel.update({_id : blog._id},{$set : {headpic:body.headpic}},function(err,blog){
     if(err) {
            return res.send({code:'-100',res:[],msg:'err'});
        }
        res.send({code:'200',res:blog,msg:'succ'}) ;
    });
}

exports.putStat = function(req,res,next){ //冻结，解冻，审核等
    
}


exports.like = function(req,res,next) { //加关注，取消关注
    

}


exports.replyCreate = function(req ,res,next){ //给博主留言


}


exports.replyDel = function(req ,res,next){ //删除留言


}

exports.replyModify = function(req ,res,next){ //修改留言


}

exports.reqlyList = function(req,res,next){ //留言列表页


}


function upadateBlog(blog,obj,callback)
