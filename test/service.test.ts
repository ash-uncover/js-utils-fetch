import { Config } from '../src/config'
import { Service } from '../src/service'

QUnit.module('Service', (globalHooks) => {

    const url = 'url'
    const api = {
        path: () => {}
    }

    const config = new Config({
        server: 'http://server'
    })

    let service

    globalHooks.beforeEach(() => {
        service = new Service(config, url, api)
    })

    /* TEST CASES */

    QUnit.module('constructor', () => {

        QUnit.test('proper instanciation', async (assert) => {
            // Declaration
            // Execution
            // Assertion
            assert.equal(service.url, url, 'the url was stored in the service')
            assert.equal(service.api, api, 'the api definition was stored in the service')
        })
    })

    QUnit.module('buildUrl', () => {

        QUnit.test('proper instanciation', async (assert) => {
            // Declaration
            const pathUrl = 'path'
            // Execution
            const fullUrl = service.buildUrl(pathUrl)
            // Assertion
            assert.equal(`${config.server}${url}${pathUrl}`, fullUrl, 'the correct url was built')
        })
    })
})