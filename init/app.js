'use strict';

const LocalStrategy = require('passport-local').Strategy;
const { encodeBase64, decodeBase64 } = require('./app/extend/util');

module.exports = app => {
  // 授权
  app.passport.mount('github');
  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {
    const user = { provider: 'local', username, password };
    app.passport.doVerify(req, user, done);
  }));

  // 处理用户信息
  app.passport.verify(async (ctx, user) => { return ctx.service.user.verify(user); });
  app.passport.serializeUser(async (ctx, user) => { return encodeBase64(JSON.stringify(user)); });
  app.passport.deserializeUser(async (ctx, user) => { return JSON.parse(decodeBase64(user)); });
};
