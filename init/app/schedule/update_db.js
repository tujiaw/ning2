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
      app.config.midhit = await SearchKey.hit();
      app.config.midhit.inchit = 0;
      app.logger.info('update db', JSON.stringify(app.config.midhit));
    }
  },
};
