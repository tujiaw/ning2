'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = options => {
  return async function midhit(ctx, next) {
    if (!(ctx.user && ctx.user._id)) {
      ctx.app.logger.info('no auth need login');
      if (ctx.method === 'GET') {
        ctx.redirect('/login');
      } else {
        ctx.body = 'error, no auth!'
      }
      return;
    }
    await next();
  };
};
