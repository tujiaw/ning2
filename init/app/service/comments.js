'use strict';

const xss = require('xss');
const Service = require('egg').Service;
const CommentsModel = require('../model/comments');

const kMaxComments = 100;
class CommentsService extends Service {
  async add(data) {
    let result;
    if (data.postId && data.name && data.content) {
      if (data.name.length > 128 || data.content.length > 2048) {
        result = '名字或内容太长！';
      } else {
        const count = await CommentsModel.countByPostId(data.postId)
        if (count >= kMaxComments) {
          result = '评论过多禁止发表新的评论';
        } else {
          data.name = xss(data.name);
          data.content = xss(data.content);
          await new CommentsModel(data).save();
        }
      }
    } else {
      result = '参数错误！';
    }
    return result;
  }

  async remove(data) {
    let msg = 'success';
    if (data && data.commentId && data.commentId.length) {
      try {
        await CommentsModel.deleteById(data.commentId);
      } catch (err) {
        msg = err;
      }
    }
    return msg;
  }
}

module.exports = CommentsService;
