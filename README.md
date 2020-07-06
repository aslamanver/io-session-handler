Pure JavaScript Module for Session Handling | [NPM](https://www.npmjs.com/package/io-session-handler)

![IO](https://i.imgur.com/K9Xp39g.png)

Socket session handler for Socket.IO

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]

## Simple Implementation

``` js
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const session_handler = require('io-session-handler').from(io)

/**
 * Connection returns - Token, ID and the Status (1 - connected, 0 - Disconnected)
 * 
 * { id: 'm3aEHZZK2f8WfG3uAAAA', token: '5200cc4a59795529', status: 1 }
 * 
 **/
session_handler.connectionListener((connection) => {
    console.log(connection)
})

http.listen(3000)
```

This array contains all the concurrent sessions `session_handler.sessions`

``` js
session_handler.sessions
```

The response will be

``` json
[
  {
    "token": "5200cc4a59795529",
    "connections": [
      "I_XzAcQOeIKw8EeMAAAA"
    ],
    "data": {
      "lat": 6.836772412061691,
      "lon": 79.87546253018081
    }
  }
]
```

Disconnect timeout can be changed using the `from` method options.

```js
const session_handler = require('io-session-handler').from(io, { timeout: 5000 })
```

## Client Connection

You can connect from Web-Client, iOS or Android

#### HTML / JavaScript

``` js
const socket = io({ query: { token: 'client-token' } })
```

#### Java

``` java
public Socket connect(String token) {
    IO.Options opts = new IO.Options();
    opts.query = "token=" + token
    Socket mSocket = IO.socket("http://127.0.0.1:3000", opts);
    mSocket.connect();
    return mSocket;
}
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the

``` bash
$ npm i io-session-handler
```

## Sample Project - Demo

This is a [demo](/demo) project.

## Advanced Usage | Push & Broadcast Messages

You can send broadcast message to all client sessions at once.

```js
session_handler.broadcastMessage(data)
```

The push method is capable of sending a push message to only a specific client session and this method returns a boolean value when the session is identified as valid.

```js
let sent = session_handler.pushMessage(client_token, data)
```

Once the message is delivered to the client, `onMessageDelivered` method will be triggered with the token of the client and the data it received.

```js
session_handler.onMessageDelivered((data) => {
    console.log(data)
})
```

The data `onMessageDelivered` contains; 

```json
{
   "token":"Token-1",
   "data":"Some awesome data I received"
}
```

## Client Implementation | Push & Broadcast Messages

Once the client received the push message it should emit to `push_message_delivery` with the data it receives and the token to let the server understand it's delivered to a certain client.

```json
{
   "token":"client_token",
   "data":"Some awesome data I received"
}
```

The client should on the `push_message` event to receive push messages from server

Android client library is available at [SCM - SCMessaging](https://aslamanver.github.io/scm/)

## License

  [MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/io-session-handler.svg
[npm-url]: https://npmjs.org/package/io-session-handler
[downloads-image]: https://img.shields.io/npm/dm/io-session-handler.svg
[downloads-url]: https://npmcharts.com/compare/io-session-handler?minimal=true
[travis-image]: https://travis-ci.org/aslamanver/io-session-handler.svg?branch=master
[travis-url]: https://travis-ci.org/aslamanver/io-session-handler
