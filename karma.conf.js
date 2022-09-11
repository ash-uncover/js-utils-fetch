module.exports = function (config) {
    const oConfig = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'sinon',
            'qunit',
            'karma-typescript'
        ],

        // list of files / patterns to load in the browser
        files: [
            'src/**/*.ts',
            'test/**/*.ts'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "**/*.ts": "karma-typescript",
            "src/**/!(*.service|index).ts": "coverage"
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'progress',
            'junit',
            'coverage'
        ],
        junitReporter: {
            outputDir: '__coverage/junit',
            outputFile: 'test-results.xml',
            useBrowserName: false
        },
        coverageReporter: {
            includeAllSources: true,
            dir: '__coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'cobertura' },
                { type: 'json', subdir: 'json'}
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--lang=en_US'
                ]
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    };
    config.set(oConfig);
    return oConfig;
};
