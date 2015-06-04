var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');

var ThumbtagsSchema = new Schema({
  tag: { type: String },  //标签
  hits : {type:Number,default:0}, //点击量
  create_at: { type: Date, default: Date.now }
});
ThumbtagsSchema.index({create_at: -1});
mongoose.model('Thumbtags', ThumbtagsSchema);
