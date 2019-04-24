'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/post/:id', controller.home.post);
  router.get('/tags/:name', controller.home.tag);
  router.get('/ym/:ym', controller.home.ym);
  router.get('/search', controller.home.search);
  router.post('/comments/add', controller.comments.add);
  router.post('/comments/remove', controller.comments.remove);
};
