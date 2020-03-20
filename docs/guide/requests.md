# Handling requests

Handler functions are just functions that either set the `ctx.res` property,
or actually write to the response in case of a `DUPLEX` call. Typically these
functions do not return anything, and we ignore their return values.

## UNARY

Unary calls are the simplest. They are simple request and response remote procedure
calls. The client calls the remote method with certain request message and the service
responds with a response message. In case of `UNARY` calls simply set `ctx.res` to
the response message value.

```js
app.use(ctx => ctx.res = { message: 'Hello ' + ctx.req.name })
```

In most cases we would do some kind of actual work within a handler that may involve
performing asynchronous actions. Mali expects and supports `Promise` implementation
in such scenarios. Using [Babel](https://babeljs.io/) or [async-to-gen](https://github.com/leebyron/async-to-gen)
we can take advantage of `async` and `await` ES6 mechanisms to make such code
cleaner and more intuitive.

```js
async function getUser(ctx) {
  // read user from database based on user id and send it once done
  ctx.res = await ctx.db.get(ctx.req.id)
}

app.use({ getUser })
```

## RESPONSE STREAM

Another type of call is where clients call a remote with a request message and
expect a stream in response that emits the message values. This is typically useful
for getting list of things based on some parameters.

For example lets say we have a JSON file, `messages.json`:

```json
[
  {
    "message": "Hello Bob"
  },
  {
    "message": "Hello Kate"
  },
  {
    "message": "Hello Jim"
  },
  {
    "message": "Hello Sara"
  }
]
```

If we have a call definition `sayHellos` that expects a stream of message,
we could stream this to the client using
[`JSONStream`](https://github.com/dominictarr/JSONStream) module:

```js
app.use('sayHellos', function sayHellos (ctx) {
  ctx.res = fs
    .createReadStream('messages.json')
    .pipe(JSONStream.parse('*'))
})
```

Another useful module for working with streams is [Highland.js](http://highlandjs.org).

## REQUEST STREAM

Similarly with a `REQEUST STREAM` call a client calls the remote with a stream of
input message values and expects a single response based on the inputs.

For example if the client sent a stream of messages it might want to know the number
successfully written and failed. Using highland we could do something like:

```js
async function doWork (inputStream) {
  const stream = fs.createWriteStream('messages.txt')
  let succeeded = 0
  let failed = 0

  return new Promise((resolve, reject) => {
    highland(inputStream)
      .tap(message => {
        try {
          stream.write(JSON.stringify(message))
          succeeded++
        } catch (e) {
          failed++
        }
      })
      .toCallback((err, result) => {
        if (err) return reject(err)
        resolve({ succeeded, failed })
      })
  })
}

app.use('writeHellos', async function writeHellos (ctx) {
  // consume all the input and do some work based on it and return a final computation value
  ctx.res = await doWork(ctx.req)
})
```

Note that since this is an asynchronous operation we (a)wait for a fulfilment of `Promise` once
we're done with all the values emitted from the input stream.

## DUPLEX

Finally, in case of `DUPLEX` call, the `ctx.req`, and `ctx.res` properties just
reference the gRPC `call` duplex stream. We implement this the same as we would
with the stock `grpc` module, just read the data coming in using `data` events
on the `ctx.req` property and and write the data to the client using the `write`
method of `ctx.res`.

```js
app.use('processStuff', async function processStuff (ctx) {
  ctx.req.on('data', d => ctx.res.write({ message: d.message.toUpperCase() }))
  ctx.req.on('end', () => ctx.res.end())
})
```
