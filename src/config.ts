const CSRF_TOKEN_DEFAULT = 'Fetch'
const CSRF_TOKEN_HEADER = 'x-csrf-token'

class Config {

    // Attributes //

    _server:string

    _csrfToken:string = ''
    _csrfEndpoint:string
    _csrfHeader:string

    _beforeHooks:Function[] = []
    _afterHooks:Function[] = []

    _debug:boolean

    // Constructor //

    constructor () {
        this._server = 'http://localhost:1337'
        this._csrfEndpoint = '/api/internal/irpa/profile/v1/profile'
        this._csrfHeader = CSRF_TOKEN_HEADER

        this.resetCSRFToken()
        this.resetBeforeHooks()
        this.resetAfterHooks()

        this._debug = false
    }

    // Getters & Setters //

    get csrfToken ():string {
        return this._csrfToken
    }

    set csrfToken (token:string) {
        this._csrfToken = token
    }

    get csrfEndpoint ():string {
        return this._csrfEndpoint
    }

    get csrfHeader ():string {
        return this._csrfHeader
    }

    set csrfHeader (header:string) {
        this._csrfHeader = header
    }

    get server ():string {
        return this._server
    }

    get beforeHooks ():Function[] {
        return this._beforeHooks
    }

    get afterHooks ():Function[] {
        return this._afterHooks
    }

    // Public methods //

    // CSRF token

    resetCSRFToken () {
        this._csrfToken = CSRF_TOKEN_DEFAULT
    }

    // Before hooks

    addBeforeHook (callback:Function) {
        this.beforeHooks.push(callback)
    }

    runBeforeHooks (url:string, request:object) {
        this.beforeHooks.forEach(hook => {
            hook(url, request)
        })
    }

    resetBeforeHooks () {
        this._beforeHooks = [
            this.addCsrfToken.bind(this),
            this.logRequest.bind(this),
        ]
    }

    // After hooks

    addAfterHook (callback:Function) {
        this.afterHooks.push(callback)
    }

    runAfterHooks (url:string, request:object, response:any) {
        this.afterHooks.forEach(hook => {
            hook(url, request, response)
        })
    }

    resetAfterHooks () {
        this._afterHooks = [
            this.readCsrfToken.bind(this),
            this.logResponse.bind(this),
        ]
    }

    // Hooks

    addCsrfToken (url:string, request:any) {
        request.headers.set(this.csrfHeader, this.csrfToken)
    }

    readCsrfToken (url:string, request:any, response:any) {
        if (this._csrfToken === CSRF_TOKEN_DEFAULT) {
            const token = response.headers.get(this.csrfHeader)
            this._csrfToken = token
        }
    }

    logRequest (url:string, request:any) {
        if (this._debug) {
            console.log(`REQUEST ${request.method} ${url}`)
            console.log('  - Options:')
            Object.keys(request).forEach((option:string) => {
                if (option !== 'headers') {
                    console.log(`    - ${option}: ${request[option]}`)
                }
            })
            if (request.headers) {
                console.log('  - Headers:')
                request.headers.forEach((value:string, key:string) => {
                    console.log(`    - ${key}: ${value}`)
                })
            }
        }
    }

    logResponse (url:string, request:any, response:any) {
        if (this._debug) {
            console.log(`RESPONSE ${request.method} ${url}`)
            if (response.headers) {
                console.log('  - Headers:')
                response.headers.forEach((value:string, key:string) => {
                    console.log(`    - ${key}: ${value}`)
                })
            }
        }
    }
}

export default new Config()