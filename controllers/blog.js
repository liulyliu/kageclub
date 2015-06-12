var blog =  require('./BlogController').blog;
var User = require('../proxy').User;



exports.index = function(req,res,next){
        
    res.render('blog/index',{});
}

exports.put = function(req,res,next){
    blog.setBlogMaster(req.session.user);   
    blog.setVisiter(req.session.user);   
    var body  = req.body;
    blog.create({
        title : body.title,
        content :body.content,
        theme :body.theme,
        tags : body.tags,
        cate_id : body.cate_id
    },function(err){
        if(!err) {
            res.render('notify/notify', {error: '提交成功'});
        } else {
            console.info(err);
        }
    })

}
