'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = options => {
  return async function midhit(ctx, next) {
    if (!(ctx.user && ctx.user._id)) {
      ctx.redirect('/login');
      return;
    }
    await next();
  };
};
