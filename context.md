# Context

### Overview

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

### Properties

Context specific properties. Some of these are just aliases and deleagated to the appropriate request or response properties.

#### ctx.name

The call name as defined within the protocol buffer definition.

#### ctx.fullName

The full call name as defined within the protocol buffer definition, including the package and service name.

#### ctx.service

The service name of the call.

#### ctx.package

The package name of the call.

#### ctx.app

The Mali application instance reference.

#### ctx.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.
This is an alias for `ctx.request.type`.

#### ctx.call

The internal gRPC call instance reference. This is an alias for `ctx.request.call`.

#### ctx.request

The Mali Request object.

#### ctx.response

The Mali Response object.

#### ctx.req

The request object. This is alias for `ctx.request.req`.
In case of `UNIRY` and `RESPONSE_STREAM` calls it is simply the gRPC `call`'s `request`. 
In case of `REQUEST_STREAM` and `DUPLEX` calls it's the gRPC `call` reference itself.

#### ctx.res

The response object. This is an alias to `ctx.response.res`.
This is set only in case of `DUPLEX` calls, to the the gRPC `call` reference itself.
In all other cases set the `res` property to the actual response message / object in case of `UNIRY` and `REQUEST_STREAM` calls, and to the output stream in case of `RESPONSE_STREAM` calls. 
When a stream it is automatically [piped](https://nodejs.org/api/stream.html#stream_event_pipe) into the call.

#### ctx.metadata

The call's request metadata plain object. This is an alias to `ctx.request.metadata`.

### Functions

#### ctx.get()

Get request metadata value. This is an alias to `ctx.request.get()`.

#### ctx.set()

Set a response header metadata value. This is an alias to `ctx.response.set()`.

#### ctx.sendMetadata()

Send response header metadata. Optionally provide header metadata object directly as an argument and that is set and sent. This is an alias to `ctx.response.sendMetadata()`.

#### ctx.getStatus()

Get response status / trailer metadata value. This is an alias to `ctx.response.getStatus()`.

#### ctx.setStatus()

Set response status / trailer metadata value. This is an alias to `ctx.response.setStatus()`.
