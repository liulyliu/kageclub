var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var utility = require('utility');
var BlogReqlySchema = new Schema({
  article_id: { type: ObjectId },
  content: { type: String },
  author_id: { type: ObjectId }, //
  blog_id: { type: ObjectId }, //
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false}
});
mongoose.model('BlogReqly', BlogReqlySchema);
