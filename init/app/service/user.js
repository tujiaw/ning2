'use strict';

const Service = require('egg').Service;
const sha1 = require('sha1');
const UsersSchema = require('../model/users');

class UserService extends Service {
  async verify(user) {
    if (user) {
      if (user.provider === 'local') {
        const data = await UsersSchema.getUserByProviderLogin(user.provider, user.username);
        if (data) {
          if (data.password === sha1(user.password)) {
            return data;
          }
          return { errmsg: '登录失败，密码不正确！' };
        }
        return { errmsg: '登录失败，用户不存在！' };
      }
      user.login = user.name;
      return user;
    }
    return { errmsg: '登录失败，鉴权失败！' };
  }
}

module.exports = UserService;
