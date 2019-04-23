'use strict';

const Controller = require('egg').Controller;

class CommentsController extends Controller {
  async add() {
    const { ctx } = this;
    const data = ctx.request.body;
    const err = await ctx.service.comments.add(data);
    if (err && err.length) {
      ctx.body = err;
      return;
    }
    ctx.redirect(data.postId ? '/post/' + data.postId : '/');
  }

  async remove() {
    const { ctx } = this;
    const data = ctx.request.body;
    console.log('comments remove', data);
    const msg = await ctx.service.comments.remove(data);
    ctx.body = msg;
  }
}

module.exports = CommentsController;
