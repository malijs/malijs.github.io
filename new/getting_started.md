# Getting Started

### Installation

```js
$ npm install mali
```

### Sample proto

```protobuf
syntax = "proto3";
package helloworld;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
  rpc SayHi (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

### Creating an application

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

### Handling request

We need to define a handler for the RPC call and set it using the `use()` method.
We can pass an object specifying our handlers.

```js
function sayHello (ctx) {
  ctx.res = { message: 'Hello ' + ctx.req.name }
}

function sayHi (ctx) {
  ctx.res = { message: 'Hi ' + ctx.req.name }
}

const app = new Mali(PROTO_PATH, 'Greeter')
app.use({ sayHello, sayHi })
```

Alternative usage specifying the name of the method and the handler:

```js
function hello (ctx) {
  ctx.res = { message: 'Hello ' + ctx.req.name }
}

function hi (ctx) {
  ctx.res = { message: 'Hi ' + ctx.req.name }
}

const app = new Mali(PROTO_PATH, 'Greeter')
app.use('sayHello', hello)
app.use('sayHi', hi)
```

### Starting the service

Just use the `start` method and passing the port. The method returns a
`grpc.Server` instance.

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

### Stopping the service
To stop and close the service use the asynchronous method `close()`.

```js
  app.close()
    .then(() => console.log('service closed'))
```

Or using `async / await`

```js
await app.close()
```
