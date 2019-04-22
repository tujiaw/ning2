'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const page = ctx.query.page || 1;
    const data = await ctx.service.home.list(page)
    await this.ctx.render('home.nj', data);
  }

  async post(id) {
    const { ctx } = this;
    console.log(ctx.params.id)
    const data = await ctx.service.home.post(ctx.params.id)
    await this.ctx.render('post.nj', data); 
  }
}

module.exports = HomeController;
