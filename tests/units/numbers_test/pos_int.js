import lib from "express-coercer"

export default {
    function: lib.Parser.stringToPosInt,
    testset: [
        // numbers
        [0, false],
        [Number.MAX_SAFE_INTEGER, true, Number.MAX_SAFE_INTEGER],
        [Number.MIN_SAFE_INTEGER, false],
        [4.5, false],
        [-15.6, false],
        // strings
        ["0", false],
        ["-34", false],
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
}