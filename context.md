# Context

### Overview

Every middleware or call handler is passed an application context. A Mali Context
encapsulates the gRPC request and response objects into a single object which
provides a few helpful properties for inspecting and handling gRPC remote calls.

### Properties

Context specific properties.

#### ctx.req

The request object. In case of `UNIRY` and `RESPONSE_STREAM` calls it is simply
the gRPC `call`'s `request` reference. In case of `REQUEST_STREAM` and `DUPLEX` calls
it's the gRPC `call` reference itself.

#### ctx.res

The response object. This is set only in case of `DUPLEX` calls, to the the gRPC
`call` reference itself. In all other cases set the `res` property to the actual
response message / object in case of `UNIRY` and `REQUEST_STREAM` calls, and to
the output stream in case of `RESPONSE_STREAM` calls. When a stream it is automatically
[piped](https://nodejs.org/api/stream.html#stream_event_pipe) into the call.

#### ctx.name

The call name as defined within the protocol buffer definition.

#### ctx.fullName

The full call name as defined within the protocol buffer definition, including the package and service name.

#### ctx.service

The service name of the call.

#### ctx.package

The package name of the call.

#### ctx.type

The call type. One of [`CallType`](https://mali.github.io/mali-call-types) enums.

#### ctx.metadata

The call metadata.

#### ctx.app

The application instance reference.

#### ctx.call

The internal gRPC call instance reference.
