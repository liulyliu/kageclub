var User = require('../proxy').User;
var config = require('../config');

exports.active = function(req, res, next) {
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


exports.putActive = function(req, res, next) {
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



exports.index = function(req, res, next) {
    var blog = req.blog;
    var blogMaster = req.blog.getBlogMaster();
    blog.getArticles([0, 10], function(err, blogList) {
        res.render('blog/index', {
            user: req.blog.getVisitor(),
            blogMaster: blogMaster,
            blog: blogMaster.blog,
            blogList : blogList || {}
        });
    });
}
exports.article = function(req,res,next){
    var article_id = req.params.article_id;
    if(!article_id) {
        return res.status(404).send('');
    }
    req.blog.getArticleById(article_id,function(err,article){
        if(err) {
            return res.status(500).send('');
        } 
        if(article) {
            var blogMaster = req.blog.getBlogMaster();
            article.visit_count ++;
            article.save();
            res.locals.blog = blogMaster.blog;
            res.render('blog/article_detail',{
                article : article,
                user : req.blog.getVisitor(),
                blogMaster : blogMaster,
                blog : blogMaster.blog
            }); 
        } else {
            return res.status(404).send('');
        }
    });
}

exports.create = function(req, res, next) {
    req.blog.getCateList(function(err, cates) {
        res.render('blog/edit', {
            cates: cates
        });
    }, true);
}

exports.put = function(req, res, next) {
    var body = req.body;

    req.blog.create({
        title: body.title,
        content: body.content,
        theme: body.theme,
        tags: body.tags,
        cate_id: body.cate_id
    }, function(err,article) {//TODO
        var blog_id = req.blog.getVisitor().blog._id
        res.redirect('/blog/' + blog_id +'/article/' + article._id);
    });
}
