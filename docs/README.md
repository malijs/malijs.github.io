---
home: true
heroImage: /mali-logo-128.png
actionText: Get Started →
features:
- title: Modern JavaScript
  details: Mali is designed for usage with modern asynchronous mechanisms utilizing `Promises` or `async / await`.
- title: Metadata
  details: Mali supports both header, trailer and error metadata.
- title: Middleware
  details: Cascading middleware can be composed to extend the minimal core and add additional features.
actionLink: /guide/
footer: Apache 2.0 Licensed | Copyright © 2018 - present Bojan D.
---

```js
const path = require('path')
const Mali = require('mali')

const PROTO_PATH = path.resolve(__dirname, '../protos/helloworld.proto')

async function sayHello (ctx) {
  ctx.res = { message: 'Hello '.concat(ctx.req.name) }
}

function main () {
  const app = new Mali(PROTO_PATH)
  app.use({ sayHello })
  app.start('127.0.0.1:50051')
}

main()
```
