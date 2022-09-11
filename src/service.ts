import Config from './config.js'

export default class Service {

    // Attributes //

    _api:any
    _url:string

    // Constructor //

    constructor (url: string, api:any) {
        this._url = url
        this._api = api
    }

    // Getters & Setters //

    get api ():any {
        return this._api
    }

    get url ():string {
        return this._url
    }

    // Public methods //

    buildUrl (pathUrl:string):string {
        return `${Config.server}${this.url}${pathUrl}`
    }

    async fetch (pathUrl:string, options:any) {
        const hasBody = options.body && (options.method === 'POST' || options.method === 'PUT')

        // Build headers
        const headers = new Headers()
        if (hasBody) {
            headers.set('content-type', options.contentType || 'application/json; charset=UTF-8')
        }
        headers.set('accept', options.accept || 'application/json')
        headers.set('accept-encoding', options.acceptEncoding || 'gzip, deflate, br')
        headers.set('connection', options.connection || 'keep-alive')

        const url = this.buildUrl(pathUrl)

        const request:RequestInit  = {
            method: options.method,
            headers,
        }
        if (hasBody) {
            request.body = options.body
        }

        Config.runBeforeHooks(url, request)

        const response = await fetch(url, request)

        Config.runAfterHooks(url, request, response)

        return response
    }
}