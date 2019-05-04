'use strict';

const SearchKey = require('../model/searchKey');

module.exports = {
  schedule: {
    cron: '0 0 * * *',
    immediate: true,
    type: 'all',
  },
  async task(ctx) {
    ctx.logger.info('start job update hit');
    ctx.app.config.midhit.inchit = 0;
    ctx.app.config.midhit = Object.assign(ctx.app.config.midhit, await SearchKey.hit());
    ctx.logger.info('update counter', JSON.stringify(ctx.app.config.midhit));
  },
};
