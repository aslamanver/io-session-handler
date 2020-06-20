const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const session_handler = require('io-session-handler').from(io)

app.set('view engine', 'ejs')
app.set('json spaces', 2)

app.get('/', function (req, res) {
    const token = req.query.token || 'some'
    res.render('index', { token: token })
});

app.get('/sessions', function (req, res) {
    res.json(session_handler.sessions)
});

app.get('/push_message', function (req, res) {
    let data = req.query.data
    io.sockets.emit('push_message', data)
    res.send(`Sent: "${data}"`)
});

session_handler.connectionListener((connection) => {
    console.log(connection)
})

setInterval(() => {
    console.log('-------------------')
    console.log(JSON.stringify(session_handler.sessions, null, 2))
    console.log('-------------------')
}, 1000)

http.listen(3000)