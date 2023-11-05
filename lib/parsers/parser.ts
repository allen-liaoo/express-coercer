export * from './boolean_parser'
export * from './number_parser'
export * from './char_parser'

export class ParseError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export function NotParsable(coerceType: string, value: any) : ParseError {
    return new ParseError(`${value} is not parsable to ${coerceType}`)
}

export function ParseWrongType(coerceType: string, expectedTypes: string[], value?: any) : ParseError {
    return new ParseError(`Parsing ${value} to ${coerceType}, but it has the wrong type (expecting a type in [${expectedTypes}])`)
}