var User = require('../proxy').User;
var config = require('../config');
var blog = require('./BlogController').blog;


exports.authAlive = function(req,res,next){
    if(blog.config.active !== true) {
       return res.render('notify/notify', {error: blog.config.msg || '管理员没有开启'+blog.config.blogName + '功能。'});
    }
    
    
    next()
}

exports.authAdmin = function(req,res,next){
    if(blog.config.adminOnly === true && (!req.session.user || !req.session.user.is_admin)) {
       return res.render('notify/notify', {error :'对不起，'+blog.config.blogName + '功能并没有向所有用户开放。'});
    }
    next();
}

exports.auth = function(req,res,next){
    blog.setBlogMaster(req.session.user);
    blog.setVisiter(req.session.user);
    blog.getBlogUser(function(err,blogUser){
        if(err) {
            return res.status(500).send('系统错误!') 
        } 
        if(!blogUser) {
            res.redirect('/blog/active');
        }  else {
            next();
        }
    })

}

exports.active = function(req,res,next){
    blog.setBlogMaster(req.session.user);
    blog.setVisiter(req.session.user);
    blog.getBlogUser(function(err,blogUser){
        if(err) {
            return res.status(500).send('系统错误!') 
        } 
        if(!blogUser) {
            res.render('blog/active',{blogName : blog.config.blogName});
        }  else {
            next();
        }
    });
}

exports.putActive = function(req,res,next){
    blog.setBlogMaster(req.session.user);
    blog.setVisiter(req.session.user);
    var body = req.body;
    console.info(body);
    blog.putActive({
    },function(){
       console.info('active') 
    })
}



exports.index = function(req, res, next) {
    res.render('blog/index', {});
}


exports.create = function(req,res,next){
    blog.setBlogMaster(req.session.user);
    blog.setVisiter(req.session.user);
    if(blog.hasBlog()) {
        blog.getCateList(function(err,cates){
            res.render('blog/edit', {
                cates : cates
            });
        },true);
    } else {
        res.render('notify/notify', {error: '您并没有开通博客，请联系管理员!' });
    }
}

exports.put = function(req, res, next) {
    blog.setBlogMaster(req.session.user);
    blog.setVisiter(req.session.user);
    var body = req.body;
    blog.create({
        title: body.title,
        content: body.content,
        theme: body.theme,
        tags: body.tags,
        cate_id: body.cate_id
    }, function(err) {
        next(err);
    });
}
