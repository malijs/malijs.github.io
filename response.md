# Response

### Overview

Mali Response class encasulates the response of a call. Clients to not create this. Mali does it for us. It is accessible via the context `response` property. Some `ctx` properties and methods are just delegated to the `response` object. It allows us to sent the response payload, alongside any header and trailer metadata.

### Example

```js
async function sayHello(ctx) {
  // set some value to the response header metadata
  ctx.response.set('foo', 'bar')) // 'bar'
  
  console.log(ctx.response.type) // 'unary'

  // set some value to the response trailer / status metatada
  ctx.response.set('biz', 'baz')

  // set the actual payload
  ctx.response.res = { message: `Hello ${ctx.req.name}!` }
}
```

### Properties

#### response.call

The internal gRPC call instance reference.

#### response.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.

#### response.metadata

The call's response header metadata plain object.

#### response.status

The call's response status / trailer metadata plain object.

#### response.res

The actual call response payload object.
This is set only in case of `DUPLEX` calls, to the the gRPC `call` reference itself.
In all other cases set the `res` property to the actual response message / object in case of `UNIRY` and `REQUEST_STREAM` calls, and to the output stream in case of `RESPONSE_STREAM` calls. 
When a stream it is automatically [piped](https://nodejs.org/api/stream.html#stream_event_pipe) into the call.

### Functions

#### response.get()

Get a response header metadata value.

#### response.set()

Set a response header metadata value.

#### response.getMetadata()

Get response header metadata as a `grpc.Metadata` object.

#### response.sendMetadata()

Send the response header metadata applied using `set()` to the client. Optionally provide header metadata object directly as an argument and that is set and sent.

#### reponse.getStatus()

Get a reponse status / trailer metadata value.

#### reponse.setStatus()

Set a reponse status / trailer metadata value.

#### reponse.getStatusMetadata()

Get reponse status / trailer metadata as a `grpc.Metadata` object.


