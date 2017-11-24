# Request

### Overview

Mali Request class encasulates the request of a call. Clients to not create this. Mali does it for us. It is accessible via the context `request` property. Some `ctx` properties and methods are just delegated to the `request` object.

### Example

```js
async function sayHello(ctx) {
  // get some value from request metadata
  console.log(ctx.request.get('foo')) // 'bar'

  // get the call type
  console.log(ctx.request.type) // 'unary'

  // get the request payload
  console.log(ctx.request.req) // { name: 'Bob' }
}
```

### Properties

#### request.call

The internal gRPC call instance reference.

#### request.req

The actuall call request object.
In case of `UNIRY` and `RESPONSE_STREAM` calls it is simply the gRPC `call`'s `request`. 
In case of `REQUEST_STREAM` and `DUPLEX` calls it's the gRPC `call` reference itself.

```js
console.log(ctx.request.req) // { name: 'Bob' }
```

#### request.metadata

The call's request metadata plain object.

```js
console.log(ctx.request.metadata)
// { 'user-agent': 'grpc-node/1.7.1 grpc-c/1.7.1 (osx; chttp2)' }
```

#### request.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.

```js
console.log(ctx.request.type) // 'unary'
```

### Functions

#### request.get()

Get a request metadata value.

```js
console.log(ctx.request.get('foo')) // 'bar'
```

#### request.getMetadata()

Get request metadata as a `grpc.Metadata` object.
