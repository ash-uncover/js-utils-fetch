export declare class Service {
    _config: any;
    _api: any;
    _url: string;
    constructor(config: any, url: string, api: any);
    get api(): any;
    get url(): string;
    buildUrl(pathUrl: string): string;
    fetch(pathUrl: string, options: any): Promise<Response>;
}
//# sourceMappingURL=service.d.ts.map