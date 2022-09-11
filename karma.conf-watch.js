const fGetSharedConf = require('./karma.conf.js');

module.exports = function (config) {
    const oSharedConf = fGetSharedConf(config);
    oSharedConf.autoWatch = true;
    oSharedConf.singleRun = false;
    config.set(oSharedConf);
};
