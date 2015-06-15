var User = require('../proxy').User;
var config = require('../config');

exports.active = function(req, res, next) {
    var blog = req.blog;
    var visitor = blog.getVisitor();
    if (!visitor.is_admin && config.blog.adminOnly) {
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
        blog = req.blog;
    return res.status(403).render('notify/notify', {
        error: '您暂时没有权限请求该资源，请联系管理员'
    });
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
    var blogMaster = req.blog.getBlogMaster();
    res.render('blog/index', {
        user: req.blog.getVisitor(),
        blogMaster: blogMaster,
        blog: blogMaster.blogUser
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
