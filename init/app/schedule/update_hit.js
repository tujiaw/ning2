'use strict';

const SearchKey = require('../model/searchKey');

module.exports = {
  schedule: {
    cron: '0 0 * * *',
    immediate: true,
    type: 'all',
  },
  async task(ctx) {
    console.log('start job update hit');
    ctx.app.config.midhit = Object.assign(ctx.app.config.midhit, await SearchKey.hit());
    console.log('update counter', JSON.stringify(ctx.app.config.midhit));
  },
};
