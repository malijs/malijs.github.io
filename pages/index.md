---
title: "Mali: Minimalistic gRPC microservice framework"
---

## What is Mali?

Mali is a minimalistic [gRPC](http://grpc.io) microservice framework for
[Node.js](http://nodejs.org). It builds on top of existing `gRPC` library
to provide an easy and powerful foundation to build microservice applications
using modern Javasript patterns. A lot of Mali design is influenced and inspired
by [Koa](http://koajs.com/), but applied to `gRPC` concepts. If you are familiar
with Koa usage, you should find development with Mali similar.

<div class="warn">
<strong>Mali is still in development and preview state. It is good for exploration, but may not
be suitable for production use yet.
</strong></div>
<br />

## Features

Mali builds on [gRPC](http://grpc.io) to provide unified patterns for handling
different form of calls. It strives to be minimalistic and simple, without adding
additional features. Rather we try to provide mechanism for adding and composing
additional features through composable middleware.

#### ECMAScript 6

Mali is built with ECMAScript 6 and is designed for usage with modern asynchronous
mechanisms utilizing `Promises` or `async / await`.

```js
app.use('getUser', async function (ctx) {
  ctx.res = await app.db.get(ctx.req.id)
})
```

#### Middleware

Cascading middleware can be composed to extend the minimal core and add additional
features such as authorization, logging, database integration, and parameter
and request validation.

```js
app.use(async function logger (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s %s - %s', ctx.name, ctx.type, ms);
})
```

## Example usage

```javascript
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')

async function sayHello (ctx) {
  ctx.res = { message: 'Hello '.concat(ctx.req.name) }
}

function main () {
  const app = new Mali(PROTO_PATH, 'Greeter')
  app.use({ sayHello })
  app.start('0.0.0.0:50051')
}

main()
```

## Next steps

* Read the [documentation](https://mali.github.com/docs)
* Explore the [examples](https://mali.github.com/examples)
* Check out the [source code](https://github.com/malijs/mali)
