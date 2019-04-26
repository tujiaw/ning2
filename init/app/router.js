'use strict';

const UsersSchema = require('./model/users');
const LocalStrategy = require('passport-local').Strategy;
const { encodeBase64, decodeBase64 } = require('./extend/util');
const sha1 = require('sha1');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 授权
  app.passport.mount('github');
  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {
    const user = { provider: 'local', username, password };
    app.passport.doVerify(req, user, done);
  }));

  // 处理用户信息
  app.passport.verify(async (ctx, user) => {
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
  });
  app.passport.serializeUser(async (ctx, user) => { return encodeBase64(JSON.stringify(user)); });
  app.passport.deserializeUser(async (ctx, user) => { return JSON.parse(decodeBase64(user)); });

  // 路由
  router.get('/', controller.home.index);
  router.get('/post/:id', controller.home.post);
  router.get('/edit/:id', controller.home.edit);
  router.post('/edit/:id', controller.home.edit);
  router.get('/delete/:id', controller.home.delete);
  router.get('/tags/:name', controller.home.tag);
  router.get('/ym/:ym', controller.home.ym);
  router.get('/search', controller.home.search);
  router.get('/textjoke', controller.home.textjoke);
  router.get('/captcha', controller.home.captcha);
  router.get('/login', controller.user.login);
  router.get('/logout', controller.user.logout);
  router.get('/login/callback', controller.user.loginCallback);
  router.post('/login', app.passport.authenticate('local', { successRedirect: '/login/callback' }));
  router.post('/comments/add', controller.comments.add);
  router.post('/comments/remove', controller.comments.remove);
};
