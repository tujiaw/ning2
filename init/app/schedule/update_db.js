'use strict';

const SearchKey = require('../model/searchKey');

module.exports = {
  schedule: {
    cron: '1 * * * * *',
    type: 'all',
  },
  async task(ctx) {
    ctx.logger.info('start job update db');
    const { midhit } = ctx.app.config;
    if (midhit.inchit > 0) {
      await SearchKey.inchit(midhit.inchit);
      ctx.app.config.midhit = await SearchKey.hit();
      ctx.app.config.midhit.inchit = 0;
      ctx.logger.info('update db', JSON.stringify(ctx.app.config.midhit));
    }
  },
};
