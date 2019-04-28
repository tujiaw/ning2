'use strict';

const Service = require('egg').Service;
const sha1 = require('sha1');
const UsersSchema = require('../model/users');

class UserService extends Service {
  async verify(user) {
    if (!user) {
      return { errmsg: '登录失败，鉴权失败！' };
    }

    let data = undefined;
    if (user.provider === 'local') {
      data = await UsersSchema.getUserByProviderLogin(user.provider, user.username);
      if (data) {
        if (data.password !== sha1(user.password)) {
          data = { errmsg: '登录失败，密码不正确！' };
        }
      }
    } else if (user.provider === 'github') {
      const content = {
        provider: user.provider,
        login: user.name,
        token: user.accessToken,
        avatar_url: user.photo,
      }
      data = await UsersSchema.getUserByProviderLogin(user.provider, user.name);
      if (data) {
        await UsersSchema.updateUserByProviderLogin(user.provider, user.name, content);
      } else {
        await new UsersSchema(content).save();
      }
      data = await UsersSchema.getUserByProviderLogin(user.provider, user.name);
    }
    if (!data) {
      data = { errmsg: '登录失败，用户不存在！'}
    }
    console.log(data)
    return data;
  }
}

module.exports = UserService;
