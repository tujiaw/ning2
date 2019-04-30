'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');
const sha1 = require('sha1');

async function render(self, view, data) {
  const { midhit } = self.config
  data.right.profile.totalhit = midhit.totalhit + midhit.inchit;
  data.right.profile.todayhit = midhit.todayhit + midhit.inchit;
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

  async delete() {
    const { ctx } = this;
    // if (!(ctx.user && ctx.user._id)) {
    //   ctx.redirect('/login');
    //   return;
    // }

    if (!ctx.params.id) {
      ctx.body = '参数错误';
      return;
    }

    await ctx.service.home.delete(ctx.params.id, ctx.user._id);
    ctx.redirect('/');
  }

  async works() {
    const { ctx } = this;
    const data = await ctx.service.home.works();
    await render(this, 'works.nj', data);
  }

  async edit() {
    const { ctx } = this;
    if (!ctx.params.id) {
      ctx.body = '参数错误';
      return;
    }

    if (ctx.method === 'GET') {
      const data = await ctx.service.home.edit(ctx.params.id);
      if (data.post) {
        data.allTags = this.config.allTags;
        await render(this, 'edit.nj', data);
      } else {
        ctx.redirect('/');
      }
    } else if (ctx.method === 'POST') {
      const { body } = ctx.request;
      const data = {
        title: body.title,
        content: body.content,
        type: body.type || '原',
        tags: body.tags.split(','),
      };
      await ctx.service.home.updatePost(body._id, ctx.user._id, data);
      ctx.redirect('/post/' + body._id);
    }
  }

  async write() {
    // 优化在router里面鉴权
    const { ctx } = this;
    if (!(ctx.user && ctx.user._id)) {
      ctx.redirect('/login');
      return;
    }

    if (ctx.method === 'GET') {
      const data = await ctx.service.home.write();
      data.allTags = this.config.allTags;
      await render(this, 'write.nj', data);
    } else if (ctx.method === 'POST') {
      const { body } = ctx.request;
      const data = {
        author: ctx.user._id,
        title: body.title,
        content: body.content,
        type: body.type || '原',
        tags: body.tags.split(','),
        pv: 1,
      };
      const newPost = await ctx.service.home.insertPost(data);
      if (newPost) {
        ctx.redirect('/post/' + newPost._id);
      } else {
        ctx.body = 'write post error!';
      }
    }
  }
}

module.exports = HomeController;
