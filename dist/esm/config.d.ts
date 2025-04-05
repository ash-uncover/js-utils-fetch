export declare class Config {
    _server: string;
    _useCsrf: boolean;
    _csrfToken: string;
    _csrfEndpoint: string;
    _csrfHeader: string;
    _beforeHooks: ((url: string, request: any) => void)[];
    _afterHooks: ((url: string, request: any, reponse: any) => void)[];
    _useDebug: boolean;
    constructor(options: {
        server: string;
        useCsrf?: boolean;
        csrfEndpoint?: string;
        csrfHeader?: string;
        useDebug?: boolean;
    });
    get csrfToken(): string;
    set csrfToken(token: string);
    get csrfEndpoint(): string;
    get csrfHeader(): string;
    set csrfHeader(header: string);
    get server(): string;
    get beforeHooks(): ((url: string, request: any) => void)[];
    get afterHooks(): ((url: string, request: any, reponse: any) => void)[];
    resetCSRFToken(): void;
    addBeforeHook(callback: (() => void)): void;
    runBeforeHooks(url: string, request: object): void;
    resetBeforeHooks(): void;
    addAfterHook(callback: (() => void)): void;
    runAfterHooks(url: string, request: object, response: any): void;
    resetAfterHooks(): void;
    addCsrfToken(url: string, request: any): void;
    readCsrfToken(url: string, request: any, response: any): void;
    logRequest(url: string, request: any): void;
    logResponse(url: string, request: any, response: any): void;
}
//# sourceMappingURL=config.d.ts.map