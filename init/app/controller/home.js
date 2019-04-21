'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const page = ctx.query.page || 1;
    const data = await ctx.service.home.list(page)
    await this.ctx.render('home.nj', data);
  }
}

module.exports = HomeController;
