"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const CSRF_TOKEN_DEFAULT = 'Fetch';
class Config {
    // Attributes //
    _server;
    _useCsrf = false;
    _csrfToken = '';
    _csrfEndpoint;
    _csrfHeader;
    _beforeHooks = [];
    _afterHooks = [];
    _useDebug;
    // Constructor //
    constructor(options) {
        this._server = options.server;
        this._useCsrf = options.useCsrf || false;
        this._csrfEndpoint = options.csrfEndpoint || '';
        this._csrfHeader = options.csrfHeader || '';
        this._useDebug = options.useDebug || false;
        this.resetCSRFToken();
        this.resetBeforeHooks();
        this.resetAfterHooks();
    }
    // Getters & Setters //
    get csrfToken() {
        return this._csrfToken;
    }
    set csrfToken(token) {
        this._csrfToken = token;
    }
    get csrfEndpoint() {
        return this._csrfEndpoint;
    }
    get csrfHeader() {
        return this._csrfHeader;
    }
    set csrfHeader(header) {
        this._csrfHeader = header;
    }
    get server() {
        return this._server;
    }
    get beforeHooks() {
        return this._beforeHooks;
    }
    get afterHooks() {
        return this._afterHooks;
    }
    // Public methods //
    // CSRF token
    resetCSRFToken() {
        this._csrfToken = CSRF_TOKEN_DEFAULT;
    }
    // Before hooks
    addBeforeHook(callback) {
        this.beforeHooks.push(callback);
    }
    runBeforeHooks(url, request) {
        this.beforeHooks.forEach(hook => {
            hook(url, request);
        });
    }
    resetBeforeHooks() {
        this._beforeHooks = [];
        if (this._useCsrf) {
            this._beforeHooks.push(this.addCsrfToken.bind(this));
        }
        if (this._useDebug) {
            this._beforeHooks.push(this.logRequest.bind(this));
        }
    }
    // After hooks
    addAfterHook(callback) {
        this.afterHooks.push(callback);
    }
    runAfterHooks(url, request, response) {
        this.afterHooks.forEach(hook => {
            hook(url, request, response);
        });
    }
    resetAfterHooks() {
        this._afterHooks = [];
        if (this._useCsrf) {
            this._afterHooks.push(this.readCsrfToken.bind(this));
        }
        if (this._useDebug) {
            this._afterHooks.push(this.logResponse.bind(this));
        }
    }
    // Hooks
    addCsrfToken(url, request) {
        if (!request.headers) {
            request.headers = new Headers();
        }
        request.headers.set(this.csrfHeader, this.csrfToken);
    }
    readCsrfToken(url, request, response) {
        if (this._csrfToken === CSRF_TOKEN_DEFAULT) {
            const token = response.headers.get(this.csrfHeader);
            this._csrfToken = token;
        }
    }
    logRequest(url, request) {
        if (this._useDebug) {
            console.log(`REQUEST ${request.method} ${url}`);
            console.log('  - Options:');
            Object.keys(request).forEach((option) => {
                if (option !== 'headers') {
                    console.log(`    - ${option}: ${request[option]}`);
                }
            });
            if (request.headers) {
                console.log('  - Headers:');
                request.headers.forEach((value, key) => {
                    console.log(`    - ${key}: ${value}`);
                });
            }
        }
    }
    logResponse(url, request, response) {
        if (this._useDebug) {
            console.log(`RESPONSE ${request.method} ${url}`);
            if (response.headers) {
                console.log('  - Headers:');
                response.headers.forEach((value, key) => {
                    console.log(`    - ${key}: ${value}`);
                });
            }
        }
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map