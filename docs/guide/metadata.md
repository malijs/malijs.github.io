---
title: Metadata
---

# Metadata

Information about a particular gRPC call can be sent using [metadata](https://grpc.io/docs/guides/concepts.html#metadata) in the form of a list of key-value pairs, where the keys are strings and the values are typically strings (but can be binary data). Calls received on the server will have a metadata object that was sent by the client. When responding to a call invocation the server can send header metadata, as well additionally status metadata upon completion of the request. Mali adds facilities for working with metadata on top of the core gRPC module.

## Receiving

When a request comes into a gRPC call handler, metadata can be accessed via both `context` and `request` properties.

**Example**

```js
async function sayHello (ctx) {
  console.log(ctx.get('foo')) // 'bar'

  // the above is just an alias for
  console.log(ctx.request.get('foo')) // 'bar'

  // we can inspect the full metadata object
  console.log(ctx.metadata)

  // which is really
  console.log(ctx.request.metadata)
}
```

## Setting and sending

### Header

Header metadata can be set using `set` function within the `context` or `response` objects.

```js
async function sayHello (ctx) {
  ctx.set('foo', 'bar')
  // or
  ctx.response.set('biz', 'baz')

  ctx.res = { message: `Hello ${ctx.req.name}` }
}
```

In the example above `{ foo: 'bar, biz: 'baz' }` is sent automatically as header metadata. `set()` can also take an object to set the metadata to. We can optionally manually set and send header metadata.

```js
async function sayHello (ctx) {
  ctx.sendMetadata({
    foo: 'bar',
    biz: 'baz'  
  })

  ctx.res = { message: `Hello ${ctx.req.name}` }
}
```

Metadata can be sent only once. On client side:

```js
const call = client.sayHello({ name: 'Bob' }, (err, res) => {
  console.log(res.message)
})

call.on('metadata', md => {
  console.log('header metadata!')
  console.log(md)
})
```

### Status / Trailer metadata

Similarly we can set the status / trailer metadata using `setStatus` functions of the `context` and `request` objects. `setStatus` can take key and value or object parameters. Mali sends this metadata automatically for us at the end of the response. Trailer metadata can be sent only once.

```js
async function sayHello (ctx) {
  ctx.setStatus('foo', 'bar')
  
  // or
  ctx.response.setStatus({ biz: 'baz' })

  ctx.res = { message: `Hello ${ctx.req.name}` }
}
```

In the example above `{ foo: 'bar, biz: 'baz' }` is sent automatically as status metadata at the end of the response.

On client:

```js
call.on('status', status => {
  console.log('status info and trailer metadata!')
  console.log(status)
})
```

For stream response and duplex calls, in addition to above we can also set status metadata using the call's `end()` function if needed.

```js
async function streamHandler(ctx) {
  const resStream = createResponseStream()
  resStream.on('end', () => {
    ctx.call.end({ foo: 'bar' })
  })
  ctx.res = resStream
}
```


