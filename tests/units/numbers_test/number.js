const lib = require("express-coercer")

module.exports.function = lib.Coercer.stringToNumber
module.exports.testset = [
    // numbers
    [0, true, 0],
    [Number.MAX_SAFE_INTEGER, true, Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER, true, Number.MIN_SAFE_INTEGER],
    [4.5, true, 4.5],
    [-15.6, true, -15.6],
    // strings
    ["0", true, 0],
    ["-34", true, -34],
    ["123", true, 123],
    ["+123", true, 123],
    ["424e5", true, 424e5],
    ["6.4", true, 6.4],
    ["-5.4", true, -5.4],
    ["123r", false],
    ["e2e3&4w", false],
    ["NaN", false],
    // others
    [NaN, false],
    [Infinity, false],
    [true, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [[1], false]
]