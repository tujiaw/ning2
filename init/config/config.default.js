'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1555751651468_1642';

  config.view = {
    mapping: {
      '.nj': 'nunjucks',
    },
    defaultExtension: '.nj',
    defaultViewEngine: 'nunjucks',
  };

  // add your middleware config here
  config.middleware = [ 'midhit' ];
  config.midhit = { totalhit: 0, todayhit: 0 };
  config.joke = { textJokeTotalCount: 0 };
  config.passportGithub = {
    key: 'b6567207454fe7fe27d4',
    secret: '00889016698c5994c76e0e23e89687fc27d2c426'
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
