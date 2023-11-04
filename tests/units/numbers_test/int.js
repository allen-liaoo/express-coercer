const lib = require("express-coercer")

module.exports.function = lib.Coercer.stringToInt
module.exports.testset = [
    // numbers
    [0, true, 0],
    [Number.MAX_SAFE_INTEGER, true, Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER, true, Number.MIN_SAFE_INTEGER],
    [4.5, false],
    [-15.6, false],
    // strings
    ["0", true, 0],
    ["-34", true, -34],
    ["123", true, 123],
    ["+123", true, 123],
    ["424e5", true, 424e5],
    ["6.4", false],
    ["-5.4", false],
    ["123r", false],
    ["e2e3&4w", false],
    // others
    [true, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [[1], false]
]