// npm run app
// For testing only
// Adding the library into dependencies:
// "express-coercer": "file: ../../../../express-coercer-0.0.1.tgz"
import express from "express"
import {
    search,
    SearchLocation,
    coerce,
    validateAll,
    Format
} from "express-coercer"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/:abc", (req, res, next) => {
    req.body = {
        a: "1.",
        b: true,
        c: "true",
        e: 0,
        test: {
            a: "0.2",
            b: 3,
            c: "false",
            c1: "true",
            d: "true1",
            test: {
                a: 1,
                b: "false"
            }
        },
        arr: ["true", "false", 0, 1, true, false]
    }
    req.body1 = JSON.parse(JSON.stringify(req.body))
    next()
})

// app.use(search({
//     locations: [
//         SearchLocation.All,
//     ],
//     targets: "a",
//     recDepth: -1,
//     searchArray: true
// }), coerce(Format.PosInt))

app.use(search({
    locations: SearchLocation.All,
    recDepth: -1,
    searchArray: true
}), coerce(Format.Boolean), validateAll)

app.use((req, res) => {
    res.status(200).json({before: req.body1, after: req.body, coercer: req.coercer})
    console.log("Result")
    console.log(JSON.stringify(req.body, undefined, 1))
})

app.listen(3000, () => {console.log("test app is listening on port 3000!")})