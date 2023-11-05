/* eslint-disable @typescript-eslint/no-var-requires */
// For testing by adding the library into dependencies:
// "express-coercer": "file: ../../../../express-coercer-0.0.1.tgz"
import express from "express"
import {
    search,
    SearchLocation,
    coerce,
    Format
} from "express-coercer"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/:abc", (req, res, next) => {
    req.body = {
        a: 4,
        b: 4,
        test: {
            a: 5,
            b: 3,
            test: [
                [{a: "+1"}, {c: 5}, 6],
                {b: 3, d: [{c: 2}]},
            ]
        }
    }
    req.query = {b: {b: {a: 2, d: {a:4}}}}
    next()
})

app.use(search({
    locations: [
        SearchLocation.All
    ],
    targets: "a",
    recDepth: -1,
    searchArray: true
}), coerce(Format.PosInt))

app.use((req, res) => {
    res.status(200).json(req.body)
})

app.listen(3000, () => {console.log("test app is listening on port 3000!")})