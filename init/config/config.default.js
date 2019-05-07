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
  config.midhit = { totalhit: 0, todayhit: 0, inchit: 0 };
  config.joke = { textJokeTotalCount: 0 };
  config.passportGithub = {
    key: 'b6567207454fe7fe27d4',
    secret: '75e127885221032bf832609ebb353c1c8a9de64d',
  };
  config.allTags = [ 'Windows', 'Linux', 'Android', 'IOS', 'Mac', 'Mobile', 'C/C++', 'Qt', 'Node.js', 'Java', 'Database',
    'Web', 'Tools', 'Bug', 'Life', 'Tips', 'Design', 'Javascript', 'MongoDB', 'React', 'Product', 'Go' ];

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'ning2',
  };

  return {
    ...config,
    ...userConfig,
  };
};
