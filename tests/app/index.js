/* eslint-disable @typescript-eslint/no-var-requires */
// For testing by adding the library into dependencies:
// "express-coercer-validator": "file: ../../../../express-coercer-validator-0.0.1.tgz"

// import lib from "express-coercer-validator"
const express = require("express")
const lib = require("express-coercer-validator")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(3000, () => {console.log("test app is listening on port 3000!")})