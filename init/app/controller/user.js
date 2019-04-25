'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    if (ctx.method === 'GET') {
      await ctx.render('login.nj');
    } else {
      // const data = await ctx.service.user.login(name, password);
    }
  }

  async githubLogin() {
    const { ctx } = this;
    ctx.redirect('https://github.com/login/oauth/authorize?client_id=531ad8e4517595748d97&state=123456789')
  }
}

module.exports = UserController;
