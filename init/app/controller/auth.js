'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async checkLogin(fn) {
    const { ctx } = this;
    if (!(ctx.user && ctx.user._id)) {
      ctx.redirect('/login');
    } else {
      fn();
    }
  }
}

module.exports = AuthController;
