# Application

## Variables

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

## Create

Similar to `grpc.Server`, Mali application can be created dynamically either by
loading a `.proto` definition file, or by loading the static `protoc` generated
Node.js code.

### Dynamic

When dynamically creating an application from static `.proto` file include the
path to the `proto` file.

```js
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')
const app = new Mali(PROTO_PATH)
```

To just use one of the services defined in the proto file state name (or an array of names) of the 
service  within the definition in the second parameter.

```js
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')
const app = new Mali(PROTO_PATH, 'Greeter')
```

### Static

Similarly we can use statically generated Node.js code

```js
const services = require('./static/helloworld_grpc_pb')
const app = new Mali(services)
```

To use only specific services from the definition we need the implementation
and the name of the service constrcutor(s).

```js
const services = require('./static/helloworld_grpc_pb')
const app = new Mali(services, 'GreeterService')
```

## Middleware

`app.use(service, name, ...fns)` is used to add the given middleware or handler function to the application.

If `service` and `name` are given, it applies `fns` for that call under that service.

```js
app.use('Greeter', 'sayHello', handler)
```

We can also use a full package name.

```js
app.use('helloworld.v1.Greeter', 'sayHello', handler)
```

If `service` name is provided and matches one of the services defined in proto, but no `name` is 
provided it applies the `fns` as service level middleware for all handlers in that service.

```js
app.use('Greeter', mwForGreeter)
```

If `service` is provided and no `name` is provided, and `service` does not match any of the service 
names in the proto, assumes `service` is actually rpc call name, and we try to find the matching service with that method name.

```js
app.use('sayHello', handler)
```

If an `object` is provided, you can set middleware and handlers for all services

```js
app.use(mw1) // global for all services
app.use('Service1', mw2) // applies to all Service1 handers
app.use({
  Service1: {
    sayGoodbye: handler1, // has mw1, mw2
    sayHello: [ mw3, handler2 ] // has mw1, mw2, mw3
  },
  'helloworld.Service2': {
    saySomething: handler3 // only has mw1
  }
})
```

```js
app.use({
  sayGoodbye: handler1, 
  sayHello: [ mw3, handler2 ] 
})
```

See [Middleware](http://mali.github.io/middleware) for more information.

## Start

Application can be started using the `start` method and passing the port. The method returns a
`grpc.Server` instance. It's just sugar for creating the native gRPC Server; calling
`grpc.Server.addService()`, hooking up the composed middleware, binding the port and 
starting the native server.

All middleware and handlers have to be set up prior to calling `start`.

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
```

The same application representation can be started on multiple ports if desired.

```js
const app = new Mali(PROTO_PATH)
app.use({ sayHello })
const server1 = app.start('127.0.0.1:50051')
const server2 = app.start('127.0.0.1:50052')
```

We can pass [server credential options](http://www.grpc.io/grpc/node/global.html#ServerCredentials)
to `start` to be passed along to native gRPC Server's [`bind`](http://www.grpc.io/grpc/node/module-src_server-Server.html) method.


A server can be started on OS-assigned dynamic port by ommiting the hostname parameter completely or by setting the "port" part of the hostname to `0`. All following examples will start a service on an OS-assigned port.

```js
app.start()
app.start('')
app.start(grpc.ServerCredentials.createInsecure())
app.start('127.0.0.1:0')
```

The application ports can be be retreived using the `ports()` function:

```js
console.log(app.ports()) // [ 50051 ]
```

## Close

To shutdown all started servers just call `app.close()` method. The method returns
a promise fulfilled when all started servers are shutdown.

```js
const app = new Mali(PROTO_PATH)
app.use({ sayHello })
const server = app.start('127.0.0.1:50051')
app.close().then(() => console.log('server(s) shut down.'))
```

## Context

All middleware and handlers are passed a context. This is the recommended namespace
to extend with information that's useful throughout the lifetime of your application,
as opposed to a per request basis.

```js
app.context.db = db()
```
