'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    if (ctx.method === 'GET') {
      ctx.session.returnTo = ctx.get('referer') || '/';
      await ctx.render('login.nj');
    } else {
      ctx.body = 'login failed!';
    }
  }

  async logout() {
    const { ctx } = this;
    ctx.logout();
    ctx.redirect(ctx.get('referer') || '/');
  }

  async loginCallback() {
    const { ctx } = this;
    if (ctx.user.errmsg) {
      await ctx.render('login.nj', ctx.user);
    } else {
      ctx.redirect(ctx.session.returnTo);
    }
  }
}

module.exports = UserController;
