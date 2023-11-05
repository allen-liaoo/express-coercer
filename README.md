# express-coercer
`express-coercer` is a middleware written for `express`. It coercers values sent in the request into specific types, and validates whether the coercion is successful.

This is not a general purpose validator. It is meant to be used in conjunction with express's `body-parser`. `body-parser` turns values into strings (or object/array with string values), whereas this library turns the strings into the right type of values.

## Usage
```js
import express from 'express'
import {
    coerce,             // Provides built-in coercer functions
    TargetLocation,     // Locations in the request object
    Format,             // Built-in supported formats
} from 'express-coercer'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(search({
    locations: SearchLocation.Body,
    targets: ["consumer_id", "provider_id"],
    rec_depth: -1       // coerce all consumer_ids and producer_ids no matter how nested they are
}),
coerce(Format.PosInt))
```
See this [example](./tests/app/index.js) of a simple express server (Using CommonJS modules).