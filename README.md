![IO](https://i.imgur.com/K9Xp39g.png)

Socket session handler for Socket. IO

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]

## Simple implementation

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

You can get all the connections using

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

## Client connection

You can connect from web-client, iOS or Android

#### HTML / JavaScript

``` js
const socket = io({ query: { token: 'client-token' } })
```

#### Java

``` java
public Socket connect(String token) {
    IO.Options opts = new IO.Options();
    opts.query = "token=" + token
    Socket mSocket = IO.socket(server, opts);
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

## License

  [MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/io-session-handler.svg
[npm-url]: https://npmjs.org/package/io-session-handler
[downloads-image]: https://img.shields.io/npm/dm/io-session-handler.svg
[downloads-url]: https://npmcharts.com/compare/io-session-handler?minimal=true
[travis-image]: https://img.shields.io/travis/aslamanver/aslam/io-session-handler.svg?branch=master
[travis-url]: https://travis-ci.org/aslamanver/io-session-handler
