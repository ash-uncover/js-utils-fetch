import { Config } from '../src/config'
import * as sinon from 'sinon'

QUnit.module('Config', () => {

    let config

    const server = 'http://server'
    const useCsrf = true
    const csrfEndpoint = 'csrfEndpoint'
    const csrfHeader = 'csrfHeader'
    const useDebug = true

    /* TEST CASES */

    QUnit.module('constructor', (hooks) => {

        hooks.beforeEach(() => {
            config = new Config({
                server,
                useCsrf,
                csrfEndpoint,
                csrfHeader,
                useDebug
            })
        })

        QUnit.test('default values', async (assert) => {
            // Declaration
            // Execution
            // Assertion
            assert.equal(config.server, server)
            assert.equal(config.csrfToken, 'Fetch')
            assert.equal(config.csrfEndpoint, csrfEndpoint)
            assert.equal(config.beforeHooks.length, 2, 'contains 2 hooks initially')
            assert.equal(config.afterHooks.length, 2, 'contains 2 hooks initially')
        })
    })

    // csrfToken //

    QUnit.module('csrfToken', () => {

        QUnit.test('can be changed', async (assert) => {
            // Declaration
            const token = 'token'
            // Execution
            config.csrfToken = token
            // Assertion
            assert.equal(config.csrfToken, token, 'token was updated')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const token = 'token'
            // Execution
            config.csrfToken = token
            config.resetCSRFToken()
            // Assertion
            assert.equal(config.csrfToken, 'Fetch', 'token was reseted')
        })
    })

    // beforeHooks //

    QUnit.module('beforeHooks', (hooks) => {

        hooks.beforeEach(() => {
            config = new Config({
                server,
                useCsrf: false,
                useDebug: false,
            })
        })

        QUnit.test('can be added', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            // Execution
            config.addBeforeHook(stubHook)
            // Assertion
            assert.equal(config.beforeHooks.length, 1, 'contains 1 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addBeforeHook(stubHook)
            // Execution
            config.resetBeforeHooks()
            // Assertion
            assert.equal(config.beforeHooks.length, 0, 'contains 0 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addBeforeHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            // Execution
            config.runBeforeHooks(url, request)
            // Assertion
            assert.equal(stubHook.callCount, 1, 'hook was called once')
            assert.equal(stubHook.calledOnceWith(url, request), true, 'the hook was called as expected')
        })

        QUnit.test('is called for each run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addBeforeHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            // Execution
            config.runBeforeHooks(url, request)
            config.runBeforeHooks(url, request)
            config.runBeforeHooks(url, request)
            // Assertion
            assert.equal(stubHook.callCount, 3, 'hook was called three times')
        })
    })

    // afterHooks //

    QUnit.module('afterHooks', (hooks) => {

        hooks.beforeEach(() => {
            config = new Config({
                server,
                useCsrf: false,
                useDebug: false,
            })
        })

        QUnit.test('can be added', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            // Execution
            config.addAfterHook(stubHook)
            // Assertion
            assert.equal(config.afterHooks.length, 1, 'contains 1 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addAfterHook(stubHook)
            // Execution
            config.resetAfterHooks()
            // Assertion
            assert.equal(config.afterHooks.length, 0, 'contains 0 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addAfterHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            const response = { headers: { get: sinon.spy() } }
            // Execution
            config.runAfterHooks(url, request, response)
            // Assertion
            assert.equal(stubHook.callCount, 1, 'hook was called once')
            assert.equal(stubHook.calledOnceWith(url, request, response), true, 'the hook was called as expected')
        })

        QUnit.test('is called for each run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            config.addAfterHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            const response = { headers: { get: sinon.spy() } }
            // Execution
            config.runAfterHooks(url, request, response)
            config.runAfterHooks(url, request, response)
            config.runAfterHooks(url, request, response)
            // Assertion
            assert.equal(stubHook.callCount, 3, 'hook was called three times')
        })
    })

    // addCsrfToken //

    QUnit.module('addCsrfToken', () => {

        QUnit.test('properly read the response header', async (assert) => {
            // Declaration
            const url = 'url'
            const stubHeader = sinon.stub()
            const request = { headers: { set: stubHeader } }
            // Execution
            config.addCsrfToken(url, request)
            // Assertion
            assert.equal(stubHeader.callCount, 1, 'the update header was called')
            assert.equal(stubHeader.calledOnceWith(config.csrfHeader, config.csrfToken), true, 'the actual token was added')
        })
    })

    // readCsrfToken //

    QUnit.module('readCsrfToken', () => {

        QUnit.test('properly read the response header', async (assert) => {
            // Declaration
            const token = 'token'
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            const response = { headers: { get: (header) => {
                return header === config.csrfHeader ? token : null
            } } }
            // Execution
            config.readCsrfToken(url, request, response)
            // Assertion
            assert.equal(config.csrfToken, token, 'token was updated')
        })
    })
})