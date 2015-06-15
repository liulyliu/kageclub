var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var BlogSchema = new Schema({
    blogname: {    //博客名称
        type: String
    },
    blogstat: { //博客状态
        type: Number,
        default: -1
    }, // -1:未开通,0:申请中，1:已开通，-2:被驳回 - 3: 被封禁
    author_id: { //博主用户id
        type: ObjectId
    },
    bloglevel : { //博客等级
        type:Number,
        default : 0
    },
    blogscore : { //博客积分
        type : Number,
        default:0
    },
    customdomain : { //个性域名
        type:String
    },
    headpic : { //头图
        type:String
    },
    bgpic : { //背景图
        type : String 
    },
    bgcss : { //背景展示样式
        type : String,
        default : ''
    },

    visit : { //访问量
        type : Number,
        default : 0
    },
    replycount : { //总回复量
        type : Number 
    },
    templte : {type : String,default:'default'}, //模板目录前缀
    create_at: {  //开通时间
        type: Date,
        default: Date.now
    },
    update_at: { //最后一次修改时间
        type: Date,
        default: Date.now
    },
    laststat_at: { //最后一次修改状态时间
        type:Date,
        default: Date.now
    }
});
mongoose.model('Blog', BlogSchema);
