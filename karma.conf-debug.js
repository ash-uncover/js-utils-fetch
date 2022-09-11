const fGetSharedConf = require('./karma.conf.js');

module.exports = function (config) {
    const oSharedConf = fGetSharedConf(config);
    oSharedConf.autoWatch = true;
    oSharedConf.singleRun = false;
    oSharedConf.browsers = ['ChromeEnUS'];
    oSharedConf.customLaunchers = {
        ChromeEnUS: {
            base: 'Chrome',
            flags: [
                '--lang=en_US'
            ]
        }
    };
    config.set(oSharedConf);
};
