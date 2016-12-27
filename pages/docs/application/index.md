---
title: Application
---

### Variables

There are a few preset application variables.

* `app.name` the name of the service taken the proto definition
* `app.env` the environment taken from `process.env.NODE_ENV` or set to default `development`
* `app.silent` whether to log errors to `console.error` within the core error handler

You can modify or add additional variables to have available globally. For example:

```js
// set config settings within the application
app.config = fs.readFileSync(CONFIG_FILE)
```

Although a more appropriate place may be the application's context. See below.

### Create

Similar to `grpc.Server`, Mali application can be created dynamically either by
loading a `.proto` definition file, or by loading the static `protoc` generated
Node.js code.

#### Dynamic

When dynamically creating an application from static `.proto` file include the
path to the `proto` file and the name of the service within the definition.

```js
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')
const app = new Mali(PROTO_PATH, 'Greeter')
```

#### Static

When creating from statically generated Node.js code, we need the implementation
and the name of the service constrcutor.

```js
const services = require('./static/helloworld_grpc_pb')
const app = new Mali(services, 'GreeterService')
```

### Middleware

`app.use()` is used to add the given middleware or handler function to this application.
See [Middleware](http://mali.github.io/middleware]) for more information.

### Start

Application can be started using the `start` method and passing the port. The method returns a
`grpc.Server` instance. It's just sugar for creating the native gRPC Server; calling
`addProtoService` or `addService` depending on what construction mechanism was used;
hooking up the composed middleware, binding the port and starting the native server.

All middleware and handlers have to be set up prior to calling `start`.

```js
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
```

The same application representation can be started on multiple ports if desired.

```js
const app = new Mali(PROTO_PATH, 'Greeter')
app.use({ sayHello })
const server1 = app.start('0.0.0.0:50051')
const server2 = app.start('0.0.0.0:50052')
```

We can pass [server credential options](http://www.grpc.io/grpc/node/global.html#ServerCredentials)
to `start` to be passed along to native gRPC Server's [`bind`](http://www.grpc.io/grpc/node/module-src_server-Server.html) method.

### Close

To shutdown all started servers just call `app.close()` method. The method returns
a promise fulfilled when all started servers are shutdown.

```js
const app = new Mali(PROTO_PATH, 'Greeter')
app.use({ sayHello })
const server = app.start('0.0.0.0:50051')
app.close().then(() => console.log('server(s) shut down.'))
```

### Context

All middleware and handlers are passed a context. This is the recommended namespace
to extend with information that's useful throughout the lifetime of your application,
as opposed to a per request basis.

```js
app.context.db = db()
```

### Error Handling

By default Mali outputs all errors to stderr `app.silent` is set to `true`.
To perform custom error-handling logic such as centralized logging you can add an "error" event listener:

```js
app.on('error', err => {
  log.error('server error', err);
})
```

If the error occurs and we have a context that's also passed along to the error handler.

```js
app.on('error', (err, ctx) => {
  log.error('server error for call %s of type %s', ctx.name, ctx.type, err);
})
```

When an error occurs we try to send it to the caller either via the response in case
of `UNARY` or `REQUEST_STREAM` calls or if appropriate via `Stream.emit()` in case
of `RESPONSE_STREAM` and `DUPLEX` calls.
