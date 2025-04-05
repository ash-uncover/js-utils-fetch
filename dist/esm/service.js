"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
class Service {
    // Attributes //
    _config;
    _api;
    _url;
    // Constructor //
    constructor(config, url, api) {
        this._config = config;
        this._url = url;
        this._api = api;
    }
    // Getters & Setters //
    get api() {
        return this._api;
    }
    get url() {
        return this._url;
    }
    // Public methods //
    buildUrl(pathUrl) {
        return `${this._config.server}${this.url}${pathUrl}`;
    }
    async fetch(pathUrl, options) {
        const url = this.buildUrl(pathUrl);
        this._config.runBeforeHooks(url, options);
        const response = await fetch(url, options);
        this._config.runAfterHooks(url, options, response);
        return response;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map