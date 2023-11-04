# express-coercer
`express-coercer` is a middleware written for `express`. It coercers values sent in the request into specific types, and validates whether the coercion is successful.

This is not a general purpose validator. It is meant to be used in conjunction with express's `body-parser`. `body-parser` turns values into strings (or object/array with string values), whereas this library turns the strings into the right type of values.

## Usage
```js
const express = require("express")
const coercer = require("express-coercer")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(coercer.validator.validate({
    location: RequestLocation.Body,
    name: "user_id",
    required: true,
    type: coercer.Types.Int,
    coerceFunc: coercer.Coercer.stringToInt
}))
```
See this [example](./tests/app/index.js) of a simple express server.