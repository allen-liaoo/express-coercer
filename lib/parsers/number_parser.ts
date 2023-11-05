import { Format } from '../coercer'
import { NotParsable, ParseWrongType } from "./parser"

// Note that this function does not allow NaN and Infinity
export function stringToNumber(value: any) : number {
    const oldVal = value
    if (typeof value === 'string') {
        value = Number(value)   // coerces string to number
        if (isNaN(value)) throw NotParsable(Format.Number, oldVal)   // if string cannot be coerced into number
    }

    // if value is not of type string or number
    if (typeof value !== 'number') throw ParseWrongType("int", ["string", "int"], oldVal)
    if (Number.isNaN(value) || !Number.isFinite(value)) throw NotParsable(Format.Number + " (not NaN nor Infinite)", oldVal)
    return value
}

export function stringToInt(value: any) : number {
    const oldVal = value
    value = stringToNumber(value)
    if (Number.isInteger(value)) 
        return value
    throw NotParsable(Format.Int, oldVal)
}

export function stringToPosInt(value: any) : number {
    const oldVal = value
    value = stringToInt(value)
    if (value == null || value <= 0) 
        throw NotParsable(Format.PosInt, oldVal)
    return value
}