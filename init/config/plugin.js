'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  passport: {
    enable: true,
    package: 'egg-passport'
  },
  passportGithub: {
    enable: true,
    package: 'egg-passport-github'
  }
};
