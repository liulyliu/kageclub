var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var utility = require('utility');

var BlogArticleSchema = new Schema({
  title: { type: String },
  content: { type: String },
  author_id: { type: ObjectId },
  tags : {type:Array},
  cate_id : {type:ObjectId},
  thumb : {type:String},
  top: { type: Boolean, default: false }, // 置顶
  lock: {type: Boolean, default: false}, // 被锁定主题
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  digg_count : {type : Number,default:0},
  collect_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
  theme : {type : String,default : 'default'}
});
mongoose.model('BlogArticle', BlogArticleSchema);
