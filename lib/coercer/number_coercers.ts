import { NotCoercable, CoerceWrongType } from "./coercer"

// Note that this function does not allow NaN and Infinity
export function stringToNumber(value: any) : number {
    const oldVal = value
    if (typeof value === 'string') {
        value = Number(value)   // coerces string to number
        if (isNaN(value)) throw NotCoercable("number", oldVal)   // if string cannot be coerced into number
    }

    // if value is not of type string or number
    if (typeof value !== 'number') throw CoerceWrongType("int", ["string", "int"], oldVal)
    if (Number.isNaN(value) || !Number.isFinite(value)) throw NotCoercable("number (not NaN nor Infinite)", oldVal)
    return value
}

export function stringToInt(value: any) : number {
    const oldVal = value
    value = stringToNumber(value)
    if (Number.isInteger(value)) 
        return value
    throw NotCoercable("int", oldVal)
}

export function stringToPosInt(value: any) : number {
    const oldVal = value
    value = stringToInt(value)
    if (value == null || value <= 0) 
        throw NotCoercable("positive int", oldVal)
    return value
}

export function stringToFloat(value: any) : number {
    const oldVal = value
    value = stringToNumber(value)
    if (value % 1 !== 0 || value === 0) 
        return value
    throw NotCoercable("int", oldVal)
}