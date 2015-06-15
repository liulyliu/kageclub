var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utility = require('utility');
var ObjectId = Schema.ObjectId;


var BlogUsersSchema = new Schema({
    blogname: {
        type: String
    },
    blogstat: {
        type: Number,
        default: -1
    }, // -1:未开通,0:申请中，1:已开通，-2:被驳回 - 3: 被封禁
    author_id: {
        type: ObjectId
    },
    templte : {type : String,default:'default'},
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    laststat_at: {
        type:Date,
        default: Date.now
    }
});
mongoose.model('BlogUsers', BlogUsersSchema);
