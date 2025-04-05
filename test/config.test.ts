import { Config } from '../src/config'

describe('Config', () => {

  let config: Config

  const server = 'http://server'
  const useCsrf = true
  const csrfEndpoint = 'csrfEndpoint'
  const csrfHeader = 'Content-Type'
  const useDebug = true

  beforeEach(() => {
    config = new Config({
      server,
      useCsrf,
      csrfEndpoint,
      csrfHeader,
      useDebug
    })
  })

  /* TEST CASES */

  // #region constructor
  describe('constructor', () => {

    test('default values', () => {
      // Declaration
      // Execution
      // Assertion
      expect(config.server).toEqual(server)
      expect(config.csrfToken).toEqual('Fetch')
      expect(config.csrfEndpoint).toEqual(csrfEndpoint)
      expect(config.beforeHooks.length).toEqual(2)
      expect(config.afterHooks.length).toEqual(2)
    })

    test('csrfHeader', () => {
      // Declaration
      // Execution
      config.csrfHeader = 'newHeader'
      // Assertion
      expect(config.csrfHeader).toEqual('newHeader')
    })
  })
  // #endregion

  // #region csrfToken
  describe('csrfToken', () => {

    test('can be changed', () => {
      // Declaration
      const token = 'token'
      // Execution
      config.csrfToken = token
      // Assertion
      expect(config.csrfToken).toEqual(token)
    })

    test('can be reseted', () => {
      // Declaration
      const token = 'token'
      // Execution
      config.csrfToken = token
      config.resetCSRFToken()
      // Assertion
      expect(config.csrfToken).toEqual('Fetch')
    })
  })
  // #endregion

  // #region beforeHooks
  describe('beforeHooks', () => {

    beforeEach(() => {
      config = new Config({
        server,
        useCsrf: false,
        useDebug: false,
      })
    })

    test('can be added', () => {
      // Declaration
      const stubHook = jest.fn()
      // Execution
      config.addBeforeHook(stubHook)
      // Assertion
      expect(config.beforeHooks.length).toEqual(1)
      expect(stubHook.mock.calls).toHaveLength(0)
    })

    test('can be reseted', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addBeforeHook(stubHook)
      // Execution
      config.resetBeforeHooks()
      // Assertion
      expect(config.beforeHooks.length).toEqual(0)
      expect(stubHook.mock.calls).toHaveLength(0)
    })

    test('can be run', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addBeforeHook(stubHook)
      const url = 'url'
      const request = { headers: { set: jest.fn() } }
      // Execution
      config.runBeforeHooks(url, request)
      // Assertion
      expect(stubHook.mock.calls).toHaveLength(1)
      expect(stubHook.mock.calls[0][0]).toEqual(url)
      expect(stubHook.mock.calls[0][1]).toEqual(request)
    })

    test('is called for each run', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addBeforeHook(stubHook)
      const url = 'url'
      const request = { headers: { set: jest.fn() } }
      // Execution
      config.runBeforeHooks(url, request)
      config.runBeforeHooks(url, request)
      config.runBeforeHooks(url, request)
      // Assertion
      expect(stubHook.mock.calls).toHaveLength(3)
    })
  })
  // #endregion

  // #region afterHooks
  describe('afterHooks', () => {

    beforeEach(() => {
      config = new Config({
        server,
        useCsrf: false,
        useDebug: false,
      })
    })

    test('can be added', () => {
      // Declaration
      const stubHook = jest.fn()
      // Execution
      config.addAfterHook(stubHook)
      // Assertion
      expect(config.afterHooks.length).toEqual(1)
      expect(stubHook.mock.calls).toHaveLength(0)
    })

    test('can be reseted', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addAfterHook(stubHook)
      // Execution
      config.resetAfterHooks()
      // Assertion
      expect(config.afterHooks.length).toEqual(0)
      expect(stubHook.mock.calls).toHaveLength(0)
    })

    test('can be run', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addAfterHook(stubHook)
      const url = 'url'
      const request = { headers: { set: jest.fn() } }
      const response = { headers: { get: jest.fn() } }
      // Execution
      config.runAfterHooks(url, request, response)
      // Assertion
      expect(stubHook.mock.calls).toHaveLength(1)
      expect(stubHook.mock.calls[0][0]).toEqual(url)
      expect(stubHook.mock.calls[0][1]).toEqual(request)
      expect(stubHook.mock.calls[0][2]).toEqual(response)
    })

    test('is called for each run', () => {
      // Declaration
      const stubHook = jest.fn()
      config.addAfterHook(stubHook)
      const url = 'url'
      const request = { headers: { set: jest.fn() } }
      const response = { headers: { get: jest.fn() } }
      // Execution
      config.runAfterHooks(url, request, response)
      config.runAfterHooks(url, request, response)
      config.runAfterHooks(url, request, response)
      // Assertion
      expect(stubHook.mock.calls).toHaveLength(3)
    })
  })
  // #endregion

  // #region addCsrfToken
  describe('addCsrfToken', () => {

    test('properly read the response header', () => {
      // Declaration
      const url = 'url'
      const stubHeader = jest.fn()
      const request = { headers: { set: stubHeader } }
      // Execution
      config.addCsrfToken(url, request)
      // Assertion
      expect(stubHeader.mock.calls).toHaveLength(1)
      expect(stubHeader.mock.calls[0][0]).toEqual(config.csrfHeader)
      expect(stubHeader.mock.calls[0][1]).toEqual(config.csrfToken)
    })

    test('with no headers', () => {
      // Declaration
      const url = 'url'
      const stubHeader = jest.fn()
      const request: any = {}
      // Execution
      config.addCsrfToken(url, request)
      // Assertion
      expect(request.headers).toBeDefined()
    })
  })
  // #endregion
  
  // #region readCsrfToken
  describe('readCsrfToken', () => {

    test('properly read the response header', () => {
      // Declaration
      const token = 'token'
      const url = 'url'
      const request = { headers: { set: jest.fn() } }
      const response = {
        headers: {
          get: (header: string) => {
            return header === config.csrfHeader ? token : null
          }
        }
      }
      // Execution
      config.readCsrfToken(url, request, response)
      // Assertion
      expect(config.csrfToken).toEqual(token)
    })
  })
  // #endregion

  // #region logRequest
  describe('logRequest', () => {

    test('properly log the request', () => {
      // Declaration
      const url = 'url'
      const request = { 
        headers: { forEach: (fn: any) => fn() },
        option: 'option'
      }
      // Execution
      config.logRequest(url, request)
    })
  })
  // #endregion

  // #region logResponse
  describe('logResponse', () => {

    test('properly log the request', () => {
      // Declaration
      const url = 'url'
      const request = { 
        method: 'method'
      }
      const response = { 
        headers: { forEach: (fn: any) => fn() },
      }
      // Execution
      config.logResponse(url, request, response)
    })
  })
  // #endregion
})