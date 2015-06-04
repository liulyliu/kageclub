var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var ThumbSchema = new Schema({
  id :{type:String},       //md5
  url: { type: String},    // 图片地址
  url2 :{type:String},     //缩略图
  tags: { type: String },  //标签
  title :{type:String}, //标题
  source : {type:String}, //来源(源图地址),
  group : {type:String}, //分组
  group_desc : {type:String}, //分组信息
  create_at: { type: Date, default: Date.now }
});
ThumbSchema.index({create_at: -1});
mongoose.model('Thumb', ThumbSchema);
