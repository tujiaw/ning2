'use strict';

const Controller = require('egg').Controller;

async function render(self, view, data) {
  data.right.profile = Object.assign(data.right.profile, self.config.midhit);
  return await self.ctx.render(view, data);
}

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await ctx.service.home.list(ctx.query.page);
    await render(this, 'home.nj', data);
  }

  async post() {
    const { ctx } = this;
    console.log(ctx.params.id);
    const data = await ctx.service.home.post(ctx.params.id);
    await render(this, 'post.nj', data);
  }

  async tag() {
    const { ctx } = this;
    const { name } = ctx.params;
    if (name && name.length) {
      const data = await ctx.service.home.tag(name, ctx.query.page);
      await render(this, 'home.nj', data);
    } else {
      ctx.redirect('/');
    }
  }

  async ym() {
    const { ctx } = this;
    const { ym } = ctx.params;
    if (ym && ym.length) {
      const data = await ctx.service.home.ym(ym, ctx.query.page);
      await render(this, 'home.nj', data);
    } else {
      ctx.redirect('/');
    }
  }
}

module.exports = HomeController;
