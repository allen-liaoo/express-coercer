# express-coercer
`express-coercer` is a request coercer middleware for `Express.js`. It coercers values sent in the request into specific types, and validates whether the coercion is successful.

This is not a general purpose validator. It is meant to be used after Express's `body-parser`. `body-parser` turns values into strings (or object/array with string values), and this library turns the strings into the right type of values.

## Usage
```js
import express from 'express'
import {
    SearchLocation,     // Locations in the request object like req.body
    search,             // middlware to set up the search mechanism for coercers
    coerce,             // Provides built-in coercer functions
    Format,             // Built-in supported formats
    validateAny,        // validator middleware
    defaultMiddleware
} from 'express-coercer'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    // Search in the request's body for any value with keys "consumer_id" or "provider_id", and
    search({
        locations: SearchLocation.Body,
        keys: ["consumer_id", "producer_id"]
    }),
    // coerces them to positive integers if possible
    coerce(Format.PosInt),
    // otherwise, use the default validator to send back a status 400 response
    validateAny
)

// uses the default middleware provided by express-coercer
// which turns strings ('true', 'false', '1', '2.5') into booleans or numbers
app.use(defaultMiddleware())
```
See [here](./tests/example) for the full example.  
Documentation can be found throughout the repository.

## Install
Run  
```$ npm install express-coercer```