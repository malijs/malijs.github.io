# Context

Every middleware or call handler is passed an application context. A Mali Context
encapsulates the Mali Request and Response objects into a single object which
provides a few helpful properties and methods for inspecting and handling gRPC remote calls.

### Example

```js
async function sayHello(ctx) {
  // get some value from request metadata
  console.log(ctx.get('foo'))

  // set some response header metadata
  ctx.set('foo', 'bar')

  // get some data from call request
  const name = ctx.req.name

  // create response payload
  ctx.res = { message: `Hello ${name}!` }

  // set response status / trailer metadata
  ctx.setStatus('biz', 'baz')
}
```

## Properties

Context specific properties. Some of these are just aliases and deleagated to the appropriate request or response properties.

### ctx.name

The call name as defined within the protocol buffer definition.

```js
console.log(ctx.name) // 'SayHello'
```

### ctx.fullName

The full call name as defined within the protocol buffer definition, including the package and service name.

```js
console.log(ctx.fullName) // '/helloworld.Greeter/SayHello'
```

### ctx.service

The service name of the call.

```js
console.log(ctx.service) // 'Greeter'
```

### ctx.package

The package name of the call.

```js
console.log(ctx.package) // 'helloworld'
```

### ctx.app

The Mali application instance reference.

### ctx.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.
This is an alias for `ctx.request.type`.

```js
console.log(ctx.type) // 'unary'
```

### ctx.call

The internal gRPC call instance reference. This is an alias for `ctx.request.call`.

### ctx.request

The Mali Request object.

### ctx.response

The Mali Response object.

### ctx.req

The request object. This is alias for `ctx.request.req`.
In case of `UNARY` and `RESPONSE_STREAM` calls it is simply the gRPC `call`'s `request`. 
In case of `REQUEST_STREAM` and `DUPLEX` calls it's the gRPC `call` reference itself.

```js
console.log(ctx.req) // { name: 'Bob' }
```

### ctx.res

The response object. This is an alias to `ctx.response.res`.
This is set only in case of `DUPLEX` calls, to the the gRPC `call` reference itself.
In all other cases set the `res` property to the actual response message / object in case of `UNARY` and `REQUEST_STREAM` calls, and to the output stream in case of `RESPONSE_STREAM` calls. 
When a stream it is automatically [piped](https://nodejs.org/api/stream.html#stream_event_pipe) into the call.

```js
ctx.res = { message: 'Hello World!' }
```

### ctx.metadata

The call's request metadata plain object. This is an alias to `ctx.request.metadata`.

```js
console.log(ctx.metadata)
// { 'user-agent': 'grpc-node/1.7.1 grpc-c/1.7.1 (osx; chttp2)' }
```

### ctx.locals

Request scoped variables that are reset on every invocation of the service method.

```js
console.log(ctx.locals) // {}
ctx.locals.foo = 'bar'
console.log(ctx.locals) // { foo: 'bar' }
```

## Functions

### ctx.get()

Get request metadata value. This is an alias to `ctx.request.get()`.

```js
console.log(ctx.get('user-agent'))
// 'grpc-node/1.7.1 grpc-c/1.7.1 (osx; chttp2)'
```

### ctx.set()

Set a response header metadata value. This is an alias to `ctx.response.set()`.

```js
ctx.set('foo', 'bar')
```

Or we can set using an object:

```js
ctx.set({
  foo: 'bar'
})
```

### ctx.sendMetadata()

Send response header metadata. Optionally provide header metadata object directly as an argument and that is set and sent. If param is not provided `sendMetadata` sends the existing metadata in the response. If it is provided existin metadata is cleared and is set to the object adn then sent. This is an alias to `ctx.response.sendMetadata()`.

```js
ctx.sendMetadata({
  foo: 'bar'
})
```

### ctx.setStatus()

Set response status / trailer metadata value. This is an alias to `ctx.response.setStatus()`.

```js
ctx.setStatus('foo', 'bar')
```

Or using an object

```js
ctx.setStatus({
  foo: 'bar'
})
```

### ctx.getStatus()

Get response status / trailer metadata value. This is an alias to `ctx.response.getStatus()`.

```js
console.log(ctx.getStatus('foo')) // 'bar'
```
