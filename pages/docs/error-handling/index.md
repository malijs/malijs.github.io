---
title: Error Handling
---

### Overview

By default Mali outputs all errors to stderr unless `app.silent` is set to `true`.
To perform custom error-handling logic such as centralized logging you can add an
`'error'` event listener:

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

### Custom errors

In addition to standard message field, gRPC Errors can also have an integer
[status code](https://github.com/grpc/grpc/blob/master/doc/statuscodes.md) and
a [Metadata](http://www.grpc.io/grpc/node/module-src_metadata-Metadata.html) property
where you can place additional contextual information for the client in the error response.

```js
const err = new Error('Not Authorized')
err.code = 5000
err.metadata = new grpc.Metadata()
err.metadata.add('type', 'AUTH')
err.metadata.add('code', '5000')
err.metadata.add('statuc', 'INVALID_TOKEN')
throw err
```

Since this would be pretty common, there are a couple of utility modules:

* [create-grpc-error](https://github.com/bojand/create-grpc-error) - Function for creating Errors for gRPC responses
* [grpc-error](https://github.com/bojand/grpc-error) - `GRPCError` class that wraps `create-grpc-error`

### Stream errors

Internally the gRPC server has an `'error'` event handler for all calls. This means
that for stream and duplex calls if there are any uncaught errors in the stream
processing the request will end with the error being passed back to the client.
Normally this is fine. Sometimes we wish full request, even though the "processing"
for some items may have failed. With proper error detection, and stream
[utilities](http://highlandjs.org) this can be accomplished and we can consume
/ collect / ignore errors and process all the items in the request. Although
**not recommended** the default _bail on error_ behaviour can be removed by
removing all the `'error'` listeners from the call via a middleware function:

```js
// NOT RECOMMENDED, DRAGONS BE HERE!
// probably at the top of middleware chain
app.use(async removeErrorListeners (ctx, next) {
  // we may want to filter based on call type here
  ctx.call.removeAllListeners('error')
  await next()
})
```

This will let you ignore / consume / collect stream errors however you wish without
gRPC server ending the request for you.
