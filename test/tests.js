const assert = require('assert')
const session_hanlder = require('../index')
const { rejects } = require('assert')

describe("Session handler", function () {

	it("sample test", async function () {

		let on_connect = (id, token) => {
			console.log('connected', id, token)
		}

		session_hanlder.onConnect('id-1', 'token-1', (id, token) => on_connect(id, token))
		session_hanlder.onConnect('id-2', 'token-1', (id, token) => on_connect(id, token))
		session_hanlder.onConnect('id-1', 'token-2', (id, token) => on_connect(id, token))

		assert.equal(session_hanlder.getSession('token-1').connections.length, 2)
		assert.equal(session_hanlder.getSession('token-2').connections.length, 1)

		assert.equal(session_hanlder.sessions.length, 2)

		await new Promise((resolve, reject) => {
			session_hanlder.onDisconnect('id-1', 'token-1', 1000, (data) => { })
			setTimeout(() => resolve(), 2000)
		}).then(() => {
			console.log(session_hanlder.sessions)
			assert.equal(session_hanlder.sessions.length, 2)
		})

		await new Promise((resolve, reject) => {
			session_hanlder.onDisconnect('id-2', 'token-1', 1000, (data) => { })
			setTimeout(() => resolve(), 2000)
		})

		console.log(session_hanlder.sessions)
		assert.equal(session_hanlder.sessions.length, 1)

		await new Promise((resolve, reject) => {
			session_hanlder.onDisconnect('id-1', 'token-2', 1000, (data) => { })
			setTimeout(() => resolve(), 2000)
		})

		console.log(session_hanlder.sessions)
		assert.equal(session_hanlder.sessions.length, 0)
	})

})