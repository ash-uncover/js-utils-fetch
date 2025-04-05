/* tslint:disable:no-console */

const CSRF_TOKEN_DEFAULT = 'Fetch'

export class Config {

  // Attributes //

  _server: string

  _useCsrf: boolean = false
  _csrfToken: string = ''
  _csrfEndpoint: string
  _csrfHeader: string

  _beforeHooks: ((url: string, request: any) => void)[] = []
  _afterHooks: ((url: string, request: any, reponse: any) => void)[] = []

  _useDebug: boolean

  // Constructor //

  constructor(options: {
    server: string,
    useCsrf?: boolean,
    csrfEndpoint?: string,
    csrfHeader?: string,
    useDebug?: boolean
  }) {
    this._server = options.server
    this._useCsrf = options.useCsrf || false
    this._csrfEndpoint = options.csrfEndpoint || ''
    this._csrfHeader = options.csrfHeader || ''
    this._useDebug = options.useDebug || false

    this.resetCSRFToken()
    this.resetBeforeHooks()
    this.resetAfterHooks()
  }

  // Getters & Setters //

  get csrfToken(): string {
    return this._csrfToken
  }

  set csrfToken(token: string) {
    this._csrfToken = token
  }

  get csrfEndpoint(): string {
    return this._csrfEndpoint
  }

  get csrfHeader(): string {
    return this._csrfHeader
  }

  set csrfHeader(header: string) {
    this._csrfHeader = header
  }

  get server(): string {
    return this._server
  }

  get beforeHooks(): ((url: string, request: any) => void)[] {
    return this._beforeHooks
  }

  get afterHooks(): ((url: string, request: any, reponse: any) => void)[] {
    return this._afterHooks
  }

  // Public methods //

  // CSRF token

  resetCSRFToken() {
    this._csrfToken = CSRF_TOKEN_DEFAULT
  }

  // Before hooks

  addBeforeHook(callback: (() => void)) {
    this.beforeHooks.push(callback)
  }

  runBeforeHooks(url: string, request: object) {
    this.beforeHooks.forEach(hook => {
      hook(url, request)
    })
  }

  resetBeforeHooks() {
    this._beforeHooks = []
    if (this._useCsrf) {
      this._beforeHooks.push(this.addCsrfToken.bind(this))
    }
    if (this._useDebug) {
      this._beforeHooks.push(this.logRequest.bind(this))
    }
  }

  // After hooks

  addAfterHook(callback: (() => void)) {
    this.afterHooks.push(callback)
  }

  runAfterHooks(url: string, request: object, response: any) {
    this.afterHooks.forEach(hook => {
      hook(url, request, response)
    })
  }

  resetAfterHooks() {
    this._afterHooks = []
    if (this._useCsrf) {
      this._afterHooks.push(this.readCsrfToken.bind(this))
    }
    if (this._useDebug) {
      this._afterHooks.push(this.logResponse.bind(this))
    }
  }

  // Hooks

  addCsrfToken(url: string, request: any) {
    if (!request.headers) {
      request.headers = new Headers()
    }
    request.headers.set(this.csrfHeader, this.csrfToken)
  }

  readCsrfToken(url: string, request: any, response: any) {
    if (this._csrfToken === CSRF_TOKEN_DEFAULT) {
      const token = response.headers.get(this.csrfHeader)
      this._csrfToken = token
    }
  }

  logRequest(url: string, request: any) {
    if (this._useDebug) {
      console.log(`REQUEST ${request.method} ${url}`)
      console.log('  - Options:')
      Object.keys(request).forEach((option: string) => {
        if (option !== 'headers') {
          console.log(`    - ${option}: ${request[option]}`)
        }
      })
      if (request.headers) {
        console.log('  - Headers:')
        request.headers.forEach((value: string, key: string) => {
          console.log(`    - ${key}: ${value}`)
        })
      }
    }
  }

  logResponse(url: string, request: any, response: any) {
    if (this._useDebug) {
      console.log(`RESPONSE ${request.method} ${url}`)
      if (response.headers) {
        console.log('  - Headers:')
        response.headers.forEach((value: string, key: string) => {
          console.log(`    - ${key}: ${value}`)
        })
      }
    }
  }
}