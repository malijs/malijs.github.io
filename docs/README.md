---
home: true
heroImage: /mali-logo-128.png
actionText: Get Started →
actionLink: /guide/
footer: Apache 2.0 Licensed | Copyright © 2018 - present Bojan D.
---

<div style="text-align: center">
  <DonateButton/>
</div>

<div class="features">
  <div class="feature">
    <h2>Modern JavaScript</h2>
    <p>Mali is designed for usage with modern asynchronous mechanisms utilizing `Promises` or `async / await`.</p>
  </div>
  <div class="feature">
    <h2>Metadata</h2>
    <p>Mali supports both header, trailer and error metadata.</p>
  </div>
  <div class="feature">
    <h2>Middleware</h2>
    <p>Cascading middleware can be composed to extend the minimal core and add additional features.</p>
  </div>
</div>

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
