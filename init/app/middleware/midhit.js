'use strict';

module.exports = options => {
  return async function midhit(ctx, next) {
    if (ctx.method === 'GET' && ctx.path !== '/captcha') {
      options.inchit += 1;
    }
    await next();
  };
};
