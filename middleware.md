# Middleware

### Overview

Creating and using Mali middleware is accomplished in the same mechanisms
as [Koa](http://koajs.com/) middleware, just taking into account the changes to
the application context. Mali middleware allows for flow both "downstream",
and then control flows back "upstream". All middleware functions have a signature
`(ctx, next)`, where the middleware should call `next` appropriately.

Simple example of a logging middleware:

```js
function sayHello (ctx) {
  ctx.res = { message: 'Hello '.concat(ctx.req.name) }
}

async function logger (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s [%s] - %s ms', ctx.name, ctx.type, ms);
}

const app = new Mali(PROTO_PATH)
app.use({ sayHello })
const server1 = app.start('0.0.0.0:50051')
```

A call to the `sayHello` remote function will result in the following log output:

```sh
SayHello [unary] - 1 ms
```

### Middleware Best Practices

This section covers middleware authoring best practices, such as middleware
accepting options, named middleware for debugging, among others.

#### Middleware options

When creating public middleware it's useful to conform to the convention of
wrapping the middleware in a function that accepts options, allowing users to
extend functionality. Even if your middleware accepts _no_ options, this is still
a good idea to keep things uniform.

Here our contrived `logger` middleware accepts a `format` string for customization,
and returns the middleware itself:

```js
function logger (format) {
  format = format || ':name [:type]'

  return async function (ctx, next) {
    const str = format
      .replace(':name', ctx.name)
      .replace(':type', ctx.type)

    console.log(str)

    await next()
  }
}

app.use(logger())
app.use(logger(':name | :type'))
```

#### Named middleware

Naming middleware is optional, however it's useful for debugging purposes to assign a name.

```js
function loggerMiddleware (format) {
  return async function logger (ctx, next) {

  }
}
```

#### Response Middleware

Middleware that decide to respond to a request and wish to bypass downstream middleware may
simply omit `next()`. Typically this will be in routing middleware, but this can be performed by
any. For example the following will respond with "two", however all three are executed, giving the
downstream "three" middleware a chance to manipulate the response.

```js
async function fn1 (ctx, next) {
  console.log('>> one')
  await next()
  console.log('<< one')
}

async function fn2 (ctx, next) {
  console.log('>> two')
  ctx.res = { message: 'two' }
  await next()
  console.log('<< two')
}

async function fn3 (ctx, next) {
  console.log('>> three')
  await next()
  console.log('<< three')
}

app.use('sayHello', fn1, fn2, fn3)
```

The following configuration omits `next()` in the second middleware, and will still respond
with "two", however the third (and any other downstream middleware) will be ignored:

```js
async function fn1 (ctx, next) {
  console.log('>> one')
  await next()
  console.log('<< one')
}

async function fn2 (ctx, next) {
  console.log('>> two')
  ctx.res = { message: 'two' }
  console.log('<< two')
}

async function fn3 (ctx, next) {
  console.log('>> three')
  await next()
  console.log('<< three')
}

app.use('sayHello', fn1, fn2, fn3)
```

When the furthest downstream middleware executes `next()`, it's really yielding to a noop
function, allowing the middleware to compose correctly anywhere in the stack.

### Async operations

Async function and promise forms Mali's foundation, allowing you to write non-blocking sequential code.
For example this middleware reads the filenames from `./docs`, and then reads the contents
of each file in parallel before assigning the response to the joint result.


```js
const fs = require('fs-promise');

app.use(async function (ctx, next) {
  const paths = await fs.readdir('docs')
  const files = await Promise.all(paths.map(path => fs.readFile(`docs/${path}`, 'utf8')))
  ctx.res = { content: files.join('') }
  await next()
})
```

### Common Middleware

| Name | Description |
|---|---|
| [apikey](https://github.com/malijs/apikey) | Api key authorization metadata middleware. |
| [bearer](https://github.com/malijs/bearer) | Bearer token authorization metadata middleware. |
| [iff](https://github.com/malijs/iff) | Conditionally add Mali middleware. |
| [jwt](https://github.com/malijs/jwt) | JWT authentication middleware. |
| [logger](https://github.com/malijs/logger) | Development logging middleware. |
| [metadata](https://github.com/malijs/metadata) | Metadata middleware. |
| [metadata auth](https://github.com/malijs/metadata-auth) | Authorization metadata middleware. |
| [metadata field auth](https://github.com/malijs/metadata-field-auth) | Mali base middleware utility for metadata auth field checks. |
| [onerror](https://github.com/malijs/onerror) | On error middleware. |
| [param](https://github.com/malijs/param) | Request param middleware. |
| [request ID](https://github.com/malijs/requestid) | Request ID metadata middleware. Sources request ID into context. |
| [toJSON](https://github.com/malijs/tojson) | Automatically calls `toJSON` on response if the method is present in response object. |
| [toObject](https://github.com/malijs/toobject) | Automatically calls `toObject` on response if the method is present in response object. |
| [transform](https://github.com/malijs/transform) | Transform response payload middleware. |
| [unless](https://github.com/malijs/unless) | Conditionally add Mali middleware. |
