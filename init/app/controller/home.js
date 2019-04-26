'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');
const sha1 = require('sha1');

async function render(self, view, data) {
  data.right.profile = Object.assign(data.right.profile, self.config.midhit);
  data.user = self.ctx.user;
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

  async search() {
    const { ctx } = this;
    const { keyword } = ctx.query;
    if (keyword && keyword.length) {
      const data = await ctx.service.home.search(keyword, ctx.query.page);
      await render(this, 'home.nj', data);
    } else {
      ctx.redirect('/');
    }
  }

  async textjoke() {
    const { ctx } = this;
    const totalCount = this.config.joke.textJokeTotalCount;
    const data = await ctx.service.home.textjoke(ctx.query.page, ctx.query.count, totalCount);
    await render(this, 'textjoke.nj', data);
  }

  async captcha() {
    const { ctx } = this;
    const data = svgCaptcha.create();
    data.text = sha1(data.text.toLowerCase());
    ctx.body = data;
  }
}

module.exports = HomeController;
