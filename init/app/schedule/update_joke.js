'use strict';

const { TextJoke } = require('../model/joke');

module.exports = {
  schedule: {
    cron: '0 1 * * *',
    immediate: true,
    type: 'all',
  },
  async task(ctx) {
    ctx.logger.info('start job update joke start');
    ctx.app.config.joke.textJokeTotalCount = await TextJoke.total();
    ctx.logger.info('start job update joke end', ctx.app.config.joke);
  },
};
