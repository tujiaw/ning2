'use strict';

const SearchKey = require('../model/searchKey');

module.exports = {
  schedule: {
    cron: '1 * * * * *',
    type: 'all',
  },
  async task(ctx) {
    const { app } = ctx;
    const { midhit } = app.config;
    if (midhit.inchit > 0) {
      app.logger.info('start job update db', midhit.inchit);
      await SearchKey.inchit(midhit.inchit);
      const hit = await SearchKey.hit();
      if (hit) {
        ctx.app.config.midhit.totalhit = hit.totalhit;
        ctx.app.config.midhit.todayhit = hit.todayhit;
        ctx.app.config.midhit.inchit = 0;
      }
      ctx.logger.info('update db', JSON.stringify(ctx.app.config.midhit));
    }
  },
};
