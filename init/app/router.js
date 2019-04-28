'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
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
  router.get('/works', controller.home.works);
  router.post('/login', app.passport.authenticate('local', { successRedirect: '/login/callback' }));
  router.post('/comments/add', controller.comments.add);
  router.post('/comments/remove', controller.comments.remove);
};
