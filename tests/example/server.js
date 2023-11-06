// npm run example
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

app.use('/*', (req, res) => {
    res.status(200).json({body: req.body, coercer: req.coercer}) // nothing went wrong
})

app.listen(3000, () => {console.log("test app is listening on port 3000!")})