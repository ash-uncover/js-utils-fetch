import Config from '../src/config'
import * as sinon from 'sinon'

QUnit.module('Config', (hooks) => {

    hooks.beforeEach(() => {
        Config.resetCSRFToken()
        Config.resetBeforeHooks()
        Config.resetAfterHooks()
    })

    /* TEST CASES */

    QUnit.module('constructor', () => {

        QUnit.test('default values', async (assert) => {
            // Declaration
            // Execution
            // Assertion
            assert.equal(Config.server, 'http://localhost:1337')
            assert.equal(Config.csrfToken, 'Fetch')
            assert.equal(Config.csrfEndpoint, '/api/internal/irpa/profile/v1/profile')
            assert.equal(Config.beforeHooks.length, 2, 'contains 2 hooks initially')
            assert.equal(Config.afterHooks.length, 2, 'contains 2 hooks initially')
        })
    })

    // csrfToken //

    QUnit.module('csrfToken', () => {

        QUnit.test('can be changed', async (assert) => {
            // Declaration
            const token = 'token'
            // Execution
            Config.csrfToken = token
            // Assertion
            assert.equal(Config.csrfToken, token, 'token was updated')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const token = 'token'
            // Execution
            Config.csrfToken = token
            Config.resetCSRFToken()
            // Assertion
            assert.equal(Config.csrfToken, 'Fetch', 'token was reseted')
        })
    })

    // beforeHooks //

    QUnit.module('beforeHooks', () => {

        QUnit.test('can be added', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            // Execution
            Config.addBeforeHook(stubHook)
            // Assertion
            assert.equal(Config.beforeHooks.length, 3, 'contains 3 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addBeforeHook(stubHook)
            // Execution
            Config.resetBeforeHooks()
            // Assertion
            assert.equal(Config.beforeHooks.length, 2, 'contains 2 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addBeforeHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            // Execution
            Config.runBeforeHooks(url, request)
            // Assertion
            assert.equal(stubHook.callCount, 1, 'hook was called once')
            assert.equal(stubHook.calledOnceWith(url, request), true, 'the hook was called as expected')
        })

        QUnit.test('is called for each run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addBeforeHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            // Execution
            Config.runBeforeHooks(url, request)
            Config.runBeforeHooks(url, request)
            Config.runBeforeHooks(url, request)
            // Assertion
            assert.equal(stubHook.callCount, 3, 'hook was called three times')
        })
    })

    // afterHooks //

    QUnit.module('afterHooks', () => {

        QUnit.test('can be added', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            // Execution
            Config.addAfterHook(stubHook)
            // Assertion
            assert.equal(Config.afterHooks.length, 3, 'contains 3 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be reseted', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addAfterHook(stubHook)
            // Execution
            Config.resetAfterHooks()
            // Assertion
            assert.equal(Config.afterHooks.length, 2, 'contains 2 hooks')
            assert.equal(stubHook.callCount, 0, 'hook was never called')
        })

        QUnit.test('can be run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addAfterHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            const response = { headers: { get: sinon.spy() } }
            // Execution
            Config.runAfterHooks(url, request, response)
            // Assertion
            assert.equal(stubHook.callCount, 1, 'hook was called once')
            assert.equal(stubHook.calledOnceWith(url, request, response), true, 'the hook was called as expected')
        })

        QUnit.test('is called for each run', async (assert) => {
            // Declaration
            const stubHook = sinon.spy()
            Config.addAfterHook(stubHook)
            const url = 'url'
            const request = { headers: { set: sinon.spy() } }
            const response = { headers: { get: sinon.spy() } }
            // Execution
            Config.runAfterHooks(url, request, response)
            Config.runAfterHooks(url, request, response)
            Config.runAfterHooks(url, request, response)
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
            Config.addCsrfToken(url, request)
            // Assertion
            assert.equal(stubHeader.callCount, 1, 'the update header was called')
            assert.equal(stubHeader.calledOnceWith(Config.csrfHeader, Config.csrfToken), true, 'the actual token was added')
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
                return header === Config.csrfHeader ? token : null
            } } }
            // Execution
            Config.readCsrfToken(url, request, response)
            // Assertion
            assert.equal(Config.csrfToken, token, 'token was updated')
        })
    })
})