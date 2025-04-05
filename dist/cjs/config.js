"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var CSRF_TOKEN_DEFAULT = 'Fetch';
var Config = /** @class */ (function () {
    // Constructor //
    function Config(options) {
        this._useCsrf = false;
        this._csrfToken = '';
        this._beforeHooks = [];
        this._afterHooks = [];
        this._server = options.server;
        this._useCsrf = options.useCsrf || false;
        this._csrfEndpoint = options.csrfEndpoint || '';
        this._csrfHeader = options.csrfHeader || '';
        this._useDebug = options.useDebug || false;
        this.resetCSRFToken();
        this.resetBeforeHooks();
        this.resetAfterHooks();
    }
    Object.defineProperty(Config.prototype, "csrfToken", {
        // Getters & Setters //
        get: function () {
            return this._csrfToken;
        },
        set: function (token) {
            this._csrfToken = token;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "csrfEndpoint", {
        get: function () {
            return this._csrfEndpoint;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "csrfHeader", {
        get: function () {
            return this._csrfHeader;
        },
        set: function (header) {
            this._csrfHeader = header;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "beforeHooks", {
        get: function () {
            return this._beforeHooks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "afterHooks", {
        get: function () {
            return this._afterHooks;
        },
        enumerable: false,
        configurable: true
    });
    // Public methods //
    // CSRF token
    Config.prototype.resetCSRFToken = function () {
        this._csrfToken = CSRF_TOKEN_DEFAULT;
    };
    // Before hooks
    Config.prototype.addBeforeHook = function (callback) {
        this.beforeHooks.push(callback);
    };
    Config.prototype.runBeforeHooks = function (url, request) {
        this.beforeHooks.forEach(function (hook) {
            hook(url, request);
        });
    };
    Config.prototype.resetBeforeHooks = function () {
        this._beforeHooks = [];
        if (this._useCsrf) {
            this._beforeHooks.push(this.addCsrfToken.bind(this));
        }
        if (this._useDebug) {
            this._beforeHooks.push(this.logRequest.bind(this));
        }
    };
    // After hooks
    Config.prototype.addAfterHook = function (callback) {
        this.afterHooks.push(callback);
    };
    Config.prototype.runAfterHooks = function (url, request, response) {
        this.afterHooks.forEach(function (hook) {
            hook(url, request, response);
        });
    };
    Config.prototype.resetAfterHooks = function () {
        this._afterHooks = [];
        if (this._useCsrf) {
            this._afterHooks.push(this.readCsrfToken.bind(this));
        }
        if (this._useDebug) {
            this._afterHooks.push(this.logResponse.bind(this));
        }
    };
    // Hooks
    Config.prototype.addCsrfToken = function (url, request) {
        if (!request.headers) {
            request.headers = new Headers();
        }
        request.headers.set(this.csrfHeader, this.csrfToken);
    };
    Config.prototype.readCsrfToken = function (url, request, response) {
        if (this._csrfToken === CSRF_TOKEN_DEFAULT) {
            var token = response.headers.get(this.csrfHeader);
            this._csrfToken = token;
        }
    };
    Config.prototype.logRequest = function (url, request) {
        if (this._useDebug) {
            console.log("REQUEST ".concat(request.method, " ").concat(url));
            console.log('  - Options:');
            Object.keys(request).forEach(function (option) {
                if (option !== 'headers') {
                    console.log("    - ".concat(option, ": ").concat(request[option]));
                }
            });
            if (request.headers) {
                console.log('  - Headers:');
                request.headers.forEach(function (value, key) {
                    console.log("    - ".concat(key, ": ").concat(value));
                });
            }
        }
    };
    Config.prototype.logResponse = function (url, request, response) {
        if (this._useDebug) {
            console.log("RESPONSE ".concat(request.method, " ").concat(url));
            if (response.headers) {
                console.log('  - Headers:');
                response.headers.forEach(function (value, key) {
                    console.log("    - ".concat(key, ": ").concat(value));
                });
            }
        }
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map