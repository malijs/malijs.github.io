# Introduction

> Minimalistic Node.js gRPC microservice framework

[![npm version](https://img.shields.io/npm/v/mali.svg?style=flat-square)](https://www.npmjs.com/package/mali)
[![build status](https://img.shields.io/travis/malijs/mali/master.svg?style=flat-square)](https://travis-ci.org/malijs/mali)
[![coverage status](https://img.shields.io/coveralls/github/malijs/mali.svg?style=flat-square)](https://coveralls.io/github/malijs/mali)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![License](https://img.shields.io/github/license/malijs/mali.svg?style=flat-square)](https://raw.githubusercontent.com/malijs/mali/master/LICENSE)
[![Greenkeeper badge](https://badges.greenkeeper.io/malijs/mali.svg)](https://greenkeeper.io/)
[![chat on gitter](https://img.shields.io/gitter/room/malijs/Lobby.svg?style=flat-square)](https://gitter.im/malijs/Lobby)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?style=flat-square)](https://www.paypal.me/bojandj)
[![Buy me a coffee](https://img.shields.io/badge/buy%20me-a%20coffee-orange.svg?style=flat-square)](https://www.buymeacoffee.com/bojand)

## What is Mali?

Mali is a minimalistic [gRPC](http://grpc.io) microservice framework for
[Node.js](http://nodejs.org). It builds on top of existing `gRPC` library
to provide an easy and powerful foundation to build microservice applications
using modern Javasript patterns. A lot of Mali design is influenced and inspired
by [Koa](http://koajs.com/), but applied to `gRPC` concepts. If you are familiar
with Koa usage, you should find development with Mali similar.

## Features

Mali builds on [gRPC](http://grpc.io) to provide unified patterns for handling
different forms of calls. It strives to be minimalistic and simple, without adding
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

#### Metadata

Mali supports both header, trailer and error metadata.

```js
app.use('getUser', async function (ctx) {
  ctx.set('headerFieldFoo', 'fooValue')
  ctx.res = await app.db.get(ctx.req.id)
  ctx.setStatus('statusFieldBar', 'barValue')
})
```

## Example usage

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
