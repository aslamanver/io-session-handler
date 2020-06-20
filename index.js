const events = require('events');

class IOSessionHandler {

    constructor() {
        this.sessions = []
        this.eventEmitter = new events.EventEmitter()
    }

    from(io, opts = { timeout: 5000 }) {

        io.sockets.on('connection', (socket) => {

            const token = socket.handshake.query.token
            const id = socket.id

            // Connected
            this.onConnect(id, token, (data) => {
                console.log(`${data.token} Connected`)
                this.emitConnectionEvent(data, 1);
            })

            socket.on('disconnect', () => {
                // Disconnected
                this.onDisconnect(id, token, opts.timeout, (data) => {
                    console.log(`${data.token} Disconnected`)
                    this.emitConnectionEvent(data, 0);
                })
            })

            socket.on('client_data', (client_data) => {
                client_data = JSON.parse(client_data)
                this.addData(client_data.token, client_data.data)
            })
        })

        return this
    }

    connectionListener(listener) {
        this.eventEmitter.on('connectionListener', (connection) => listener(connection));
    }

    emitConnectionEvent(connection, status) {
        connection.status = status;
        this.eventEmitter.emit('connectionListener', connection);
    }

    pushToken(id, token) {
        if (this.getSession(token)) {
            this.sessions.forEach((session) => {
                if (session.token === token) {
                    session.connections.push(id)
                }
            })
        } else {
            this.sessions.push({ token, connections: [id] })
        }
    }

    getSession(token) {
        return this.sessions.filter((session) => session.token === token)[0]
    }

    disconnectConnection(id, token) {
        this.sessions.forEach((session, index) => {
            if (session.token === token) {
                session.connections.splice(session.connections.indexOf(id), 1)
                if (session.connections.length == 0) {
                    this.sessions.splice(index, 1)
                }
            }
        })
    }

    onConnect(id, token, callback) {
        if (!this.getSession(token)) callback({ id, token })
        this.pushToken(id, token)
    }

    onDisconnect(id, token, timeout, callback) {
        setTimeout(() => {
            this.disconnectConnection(id, token)
            if (!this.getSession(token)) callback({ id, token })
        }, timeout)
    }

    onLogout() {
        this.sessions.forEach((session) => {
            if (session.token === token) {
                session.connections.forEach((connection) => {
                    io.to(connection).emit('logout')
                })
            }
        })
    }

    addData(token, data) {
        this.getSession(token).data = data
    }
}

module.exports = new IOSessionHandler()