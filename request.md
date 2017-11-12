# Request

### Overview

Mali Request class encasulates the request of a call. Clients to not create this. Mali does it for us. It is accessible via the context `request` property. Some `ctx` properties and methods are just delegated to the `request` object.

### Example

```js
async function sayHello(ctx) {
  // get some value from request metadata
  console.log(ctx.request.get('foo')) // 'bar'
  console.log(ctx.request.type) // 'unary'
}
```

### Properties

#### request.call

The internal gRPC call instance reference.

#### request.req

The actuall call request object.
In case of `UNIRY` and `RESPONSE_STREAM` calls it is simply the gRPC `call`'s `request`. 
In case of `REQUEST_STREAM` and `DUPLEX` calls it's the gRPC `call` reference itself.

#### request.metadata

The call's request metadata plain object.

#### request.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.

### Functions

#### request.get()

Get a request metadata value.

#### request.getMetadata()

Get request metadata as a `grpc.Metadata` object.
