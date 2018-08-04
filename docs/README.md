---
home: true
heroImage: /mali-logo-128.png
actionText: Get Started →
features:
- title: Modern JavaScript
  details: Mali is designed for usage with modern asynchronous mechanisms utilizing `Promises` or `async / await`.
- title: Metadata
  details: Mali supports header, trailer, status, and error metadata.
- title: Middleware
  details: Cascading middleware can be composed to extend the minimal core and add additional features.
actionLink: /guide/
footer: Apache 2.0 Licensed | Copyright © 2018 - present Bojan D.
---

[![npm version](https://img.shields.io/npm/v/mali.svg?style=flat-square)](https://www.npmjs.com/package/mali)
[![build status](https://img.shields.io/travis/malijs/mali/master.svg?style=flat-square)](https://travis-ci.org/malijs/mali)
[![coverage status](https://img.shields.io/coveralls/github/malijs/mali.svg?style=flat-square)](https://coveralls.io/github/malijs/mali)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/github/license/malijs/mali.svg?style=flat-square)](https://raw.githubusercontent.com/malijs/mali/master/LICENSE)
[![Greenkeeper badge](https://badges.greenkeeper.io/malijs/mali.svg)](https://greenkeeper.io/)
[![chat on gitter](https://img.shields.io/gitter/room/malijs/Lobby.svg?style=flat-square)](https://gitter.im/malijs/Lobby)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?style=flat-square)](https://www.paypal.me/bojandj)

### Full server in a few lines of code...

```js
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')

async function sayHello (ctx) {
  ctx.res = { message: 'Hello '.concat(ctx.req.name) }
}

function main () {
  const app = new Mali(PROTO_PATH)
  app.use({ sayHello })
  app.start('127.0.0.1:50051')
}

main()
```
