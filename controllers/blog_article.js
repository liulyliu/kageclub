var User = require('../proxy').User;
var config = require('../config');

exports.article = function(req,res,next){ //文章页
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

exports.create = function(req, res, next) { //发布页
    req.blog.getCateList(function(err, cates) {
        res.render('blog/edit', {
            cates: cates
        });
    }, true);
}

exports.put = function(req, res, next) {//发布post
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


exports.modify = function(req,res,next){ //修改页

}

exports.putModify = function(req,res,next){//修改post

}


exports.del = function(req,res,next){ //删除文章


}

exports.list = function(req,res,next){ //文章列表页

}

exports.digg = function(req,res,next){ //置顶


}


exports.collect = function(req,res,next){ //收藏

}


exports.lock = function(req,res,next){ //锁定


}

