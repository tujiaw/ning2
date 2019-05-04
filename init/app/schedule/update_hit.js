'use strict';

const SearchKey = require('../model/searchKey');
let isImmediate = true;

module.exports = {
  schedule: {
    cron: '0 0 * * *',
    immediate: isImmediate,
    type: 'all',
  },
  async task(ctx) {
    ctx.logger.info('start job update hit');
    if (!isImmediate) {
      await SearchKey.clearTodayHit();
    }
    const hit = await SearchKey.hit();
    if (hit) {
      ctx.app.config.midhit.totalhit = hit.totalhit;
      ctx.app.config.midhit.todayhit = hit.todayhit;
    }
    ctx.logger.info('update counter', JSON.stringify(ctx.app.config.midhit));
    isImmediate = false;
  },
};
