var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;
var BlogCateSchema = new Schema({
  catename: { type: String },
  author_id: { type: ObjectId },
  blog_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});
mongoose.model('BlogCate', BlogCateSchema);
