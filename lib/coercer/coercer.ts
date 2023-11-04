import { Types } from '../defaults'
import { stringToInt, stringToNumber, stringToPosInt } from './number_coercers'

export * from './number_coercers'

export class CoerceError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export function NotCoercable(coerceType: string, value: any) : CoerceError {
    return new CoerceError(`${value} is not coercable to ${coerceType}`)
}

export function CoerceWrongType(coerceType: string, expectedTypes: string[], value?: any) : CoerceError {
    return new CoerceError(`Coercing ${value} to ${coerceType}, but it has the wrong type (expecting a type in [${expectedTypes}])`)
}

export function getDefaultCoercer(type: Types) : (value: any) => unknown {
    switch (type) {
        case Types.Number: return stringToNumber
        case Types.Int: return stringToInt
        case Types.PosInt: return stringToPosInt
        case Types.String: return (e) => e.toString()
        default: return (e) => e    // identity function
    }
}