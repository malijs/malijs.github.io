# Error Handling

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
