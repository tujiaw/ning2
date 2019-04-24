'use strict';

module.exports = options => {
  return async function midhit(ctx, next) {
    if (ctx.method === 'GET' && ctx.path !== '/captcha') {
      options.totalhit += 1;
      options.todayhit += 1;
    }
    await next();
  };
};
