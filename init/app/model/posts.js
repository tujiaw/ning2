'use strict';

const mongoose = require('./mongo').mongoose;
const config = require('../../config/config.model.js');
const PAGE_COUNT = config.pageCount;

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  content: { type: String },
  pv: { type: Number },
  tags: { type: [ String ] },
  type: { type: String },
});

PostSchema.statics.getAll = function() {
  return this.find({}).exec();
};

PostSchema.statics.getPostById = function(postId) {
  return this.findOne({ _id: postId }).exec();
};

PostSchema.statics.getPostsProfile = function(author, page) {
  const query = {};
  if (author) {
    query.author = author;
  }
  if (page && page > 0) {
    return this.find(query)
      .skip(PAGE_COUNT * (page - 1))
      .limit(PAGE_COUNT)
      .sort({ _id: -1 })
      .exec();
  }
  return this.find(query).sort({ _id: -1 }).exec();
};

PostSchema.statics.getPostsCount = function(author) {
  const query = {};
  if (author) {
    query.author = author;
  }
  return this.countDocuments(query).exec();
};

PostSchema.statics.incPv = function(postId) {
  return this.updateOne({ _id: postId }, { $inc: {pv: 1} }).exec();
};

PostSchema.statics.getPostByTag = function(tag) {
  tag = tag.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, '\\$1');
  return this.find({tags: { $in: [new RegExp(tag, 'i')]}})
    .sort({ _id: -1 })
    .exec();
};

PostSchema.statics.searchPost = function(name, onlyTitle) {
  const keyword = name.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, '\\$1');
  let cond = {
    '$or': [
      {title: new RegExp(keyword, 'i')},
      {content: new RegExp(keyword, 'i')}
    ]
  }
  if (onlyTitle) {
    cond = { title: new RegExp(keyword, 'i') }
  }
  return this.find(cond).sort({ 'pv': -1 }).exec();
};

PostSchema.statics.hotSearchPost = function(count) {
  return this.find({}).sort({'pv': -1}).limit(count).exec();
};

PostSchema.statics.updatePostById = function(postId, author, content) {
  return this.updateOne({ author: author, _id: postId }, { $set: content }).exec();
};

PostSchema.statics.delPostById = function(postId, author) {
  return this.remove({ author: author, _id: postId }).exec();
};

PostSchema.statics.getPrevPostById = function(postId) {
  return this.find({ _id: { $gt: postId } }).sort({ _id: 1 }).limit(1).exec();
}

PostSchema.statics.getNextPostById = function(postId) {
  return this.find({ _id: { $lt: postId } }).sort({ _id: -1 }).limit(1).exec();
}

module.exports = mongoose.blogConn.model('Posts', PostSchema);
