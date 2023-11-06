import { Format, CoerceError, CoercerFunction } from "./types"

/*
Default coercer function that turns
1. 'true' and 'false' to boolean values
2. Number strings (i.e. '0', '3.4', '23e5') to numbers
*/
export function defaultCoercer(value: any) : any {
    if (typeof value === 'string') {
        try {
            value = strictStringToBoolean(value)
        } catch (e) { 
            try {
                value = stringToNumber(value)
            } catch (e) { /* empty */ }
        }
    }
    return value
}

export function getCoercerByFormat(format: Format) : CoercerFunction {
    switch (format) {
        case Format.Number: return stringToNumber
        case Format.Int: return stringToInt
        case Format.PosInt: return stringToPosInt
        case Format.String: return anyToString
        case Format.Char: return intToChar
        case Format.Boolean: return strictStringToBoolean
        default: return (e) => e    // identity function
    }
}

/*
Default for Format.Number
Turns a string into a number, throws CoerceError if that is not possible
Note that this function does not allow NaN and Infinity
*/
export function stringToNumber(value: any) : number {
    const expectedFormats = ["String of number", "Number"]
    if (typeof value === 'string') {
        value = Number(value)   // coerces string to number
        if (isNaN(value)) throw new CoerceError(...expectedFormats)   // if string cannot be coerced into number
    }

    // if value is not of type string or number
    if (typeof value !== 'number') throw new CoerceError("string", "int")
    if (Number.isNaN(value) || !Number.isFinite(value)) throw new CoerceError(...expectedFormats)
    return value
}

/*
Default for Format.Int
Turns a string into an integer, throws CoerceError if that is not possible
Note that this function does not allow NaN and Infinity
*/
export function stringToInt(value: any) : number {
    value = stringToNumber(value)
    if (Number.isInteger(value)) 
        return value
    throw new CoerceError("String of integer", "Integer number")
}

/*
Default for Format.PosInt
Turns a string into a positive integer, throws CoerceError if that is not possible
Note that this function does not allow NaN and Infinity
*/
export function stringToPosInt(value: any) : number {
    value = stringToInt(value)
    if (value == null || value <= 0) 
        throw new CoerceError("String of positive integer", "Positive integer number")
    return value
}

/*
Default for Format.Boolean
Turns "true" to true and "false" to false, or throws CoerceError otherwise
*/
export function strictStringToBoolean(value: any) : boolean {
    if (value == 'true' || value == 'false') {
        return value == 'true'
    }
    throw new CoerceError("String literal 'true' or 'false'")
}

/*
Default for Format.Char
Turns any integer in the range specified by String.fromCharCode() to a character
Throws CoerceError otherwise
*/
export function intToChar(value: any) : string {
    try {
        return String.fromCharCode(value)
    } catch (e) {
        throw new CoerceError("Integer (see String.fromCharCode())")
    }
}

/*
Default for Format.String
Turns any value to a string using JSON.stringify()
Throws CoerceError if JSON.stringify() fails
*/
export function anyToString(value: any) : string {
    try {
        return JSON.stringify(value)
    } catch (e) {
        throw new CoerceError("Any value compatible with JSON.stringify()")
    }
}