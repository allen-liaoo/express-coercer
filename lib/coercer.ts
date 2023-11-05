import { strictStringToBoolean } from './parsers/boolean_parser'
import { intToChar } from './parsers/char_parser'
import { stringToInt, stringToNumber, stringToPosInt } from './parsers/number_parser'
import { cleanup } from './searcher'

export const Format = {
    Number: 'number', // can be int or float, but not NaN or Infinite
    Int: 'integer',
    PosInt: 'positive integer',
    String: 'string',
    Char: 'char',
    Boolean: 'boolean'
} as const

// as const makes the type expression specific enough to include the literal strings

export type Format = typeof Format[
    // keyof creates a union type from keys
    keyof typeof Format
]
// we take those keys as strings, and do a lookup to find its values which we set as the type

const Formats = ['number', 'integer', 'positive integer', 'string', 'char', 'boolean']

export function isFormat(value: any) : value is Format {
    if (typeof value === 'string' &&
        Formats.includes(value))
        return true
    return false
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getDefaultParser(format: Format) : Function {
    switch (format) {
        case Format.Number: return stringToNumber
        case Format.Int: return stringToInt
        case Format.PosInt: return stringToPosInt
        case Format.String: return (e) => e.toString()
        case Format.Char: return intToChar
        case Format.Boolean: return strictStringToBoolean
        default: return (e) => e    // identity function
    }
}

export interface CoerceOptions {
    cleanup?: boolean
}

// Turn coercers into a Functions array
// eslint-disable-next-line @typescript-eslint/ban-types
function buildCoercers(coercers: Format | Format[] | Function | Function[]) {
    let coercerFuncs: any[]
    if (!Array.isArray(coercers)) coercerFuncs = [coercers]
    else coercerFuncs = coercers
    coercerFuncs = coercerFuncs.map((e) => {
        if (isFormat(e)) return getDefaultParser(e)
        return e
    })
    return coercerFuncs
}

/*
coercers: Either a Format, a Format array, a function, or a functions array
1. If coercers is a Format or a Format array: 
    The default parser for the corresponding format(s) is used (See getDefaultParser())
2. If coercers is a function or a list of functions:
    Each function takes a value of any type and returns some value or throws an error. 
    Specifically, if a function is a coercer, it should either coerces the value to some format, leave it unchanged, or throws a CoerceError
    The functions are called in the order that they are listed.
*/
// eslint-disable-next-line @typescript-eslint/ban-types
export function coerce(coercers: Format | Format[] | Function | Function[], options: CoerceOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    return function(req: any, res: any, next: Function) {
        // ignore this if no search is set up
        if (!req.expressCoercer) {
            next()
            return
        }

        // Construct and validate coerce options
        const ops: Required<CoerceOptions> = {
            cleanup: false,
            ...options      // override defaults with user defined options
        }

        // Turn coercer into type Function[]
        const coercerFuncs: any[] = buildCoercers(coercers)

        for (const func of coercerFuncs) {
            req.expressCoercer.search(func)
        }

        // cleanup
        if (ops.cleanup) {
            cleanup(req, res, next)
        } else next()
    }
}