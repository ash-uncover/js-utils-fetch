export class Service {

  // Attributes //

  _config: any
  _api: any
  _url: string

  // Constructor //

  constructor(config: any, url: string, api: any) {
    this._config = config
    this._url = url
    this._api = api
  }

  // Getters & Setters //

  get api(): any {
    return this._api
  }

  get url(): string {
    return this._url
  }

  // Public methods //

  buildUrl(pathUrl: string): string {
    return `${this._config.server}${this.url}${pathUrl}`
  }

  async fetch(pathUrl: string, options: any) {
    const url = this.buildUrl(pathUrl)

    this._config.runBeforeHooks(url, options)

    const response = await fetch(url, options)

    this._config.runAfterHooks(url, options, response)

    return response
  }
}