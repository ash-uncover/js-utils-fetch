import { Config } from '../src/config'
import { Service } from '../src/service'

describe('Service', () => {

  const url = 'url'
  const api = {
    path: () => { }
  }

  const config = new Config({
    server: 'http://server'
  })

  let service: Service
  let fetchMock: any
  const response = { data: 100 }

  beforeEach(() => {
    service = new Service(config, url, api)
  })

  /* TEST CASES */

  // #region constructor
  describe('constructor', () => {

    test('proper instanciation', () => {
      // Declaration
      // Execution
      // Assertion
      expect(service.url).toEqual(url)
      expect(service.api).toEqual(api)
    })
  })
  // #endregion

  // #region buildUrl
  describe('buildUrl', () => {

    test('proper instanciation', () => {
      // Declaration
      const pathUrl = 'path'
      // Execution
      const fullUrl = service.buildUrl(pathUrl)
      // Assertion
      expect(`${config.server}${url}${pathUrl}`).toEqual(fullUrl)
    })
  })
  // #endregion

  // #region fetch
  describe('fetch', () => {

    beforeEach(() => {
      // @ts-ignore
      global.fetch = jest.fn(() => Promise.resolve(response))
    })
  
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('proper instanciation', () => {
      // Declaration
      const pathUrl = 'path'
      const options = {}
      // Execution
      return service.fetch(pathUrl, options)
      .then(data => {
        // Assertion
        expect(data).toEqual(response)
      })
    })
  })
  // #endregion
})