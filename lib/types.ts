import { SearchCallback, SearchOptions } from "./searcher"

/*
 * express-coercer creates a coercer object under req.coercer when a searcher is created.
 * This object implements the interface ExpressCoercer.
 * 
 * searchOptions: The SearchOptions supplied to the searcher, where each value is defined 
 *      either by the user or by default
 * searchLocations: The references to the actual objects to search in
 *      It is searchOptions.locations where each Format value is replaced by their corresponding object reference
 * search: The search function. You should not call this function. The callback function is implemented for you and called by coerce().
 * results: The array of coerce results. Can be used for validation.
*/
export interface ExpressCoercer {
    searchOptions?: Required<SearchOptions>,
    searchLocations?: object[],
    search?: (callback: SearchCallback) => void,
    results?: CoerceResult[]
}

/*
 * The result of coercing a value, which includes
 * success: true if coercion was successful
 * key: key of the value coerced
 * before: the value beforehand (not null/undefined)
 * after: the value afterwards (undefined if coercion was unsuccessful)
 * coercer: the coercer function used
 * error: the error encountered by coercion (undefined if coercion was successful)
 */
export interface CoerceResult {
    success: boolean
    key: string
    before: any
    after?: any
    coercer: CoercerFunction
    error?: CoerceError | any
}

/*
 * A coercer should either coerces the value to some format, leave it unchanged, or throws a CoerceError
*/
export type CoercerFunction = (value: any) => unknown | never

export class CoerceError {
    // names of the expected format
    expectedFormats: string[]
    constructor(...expectedFormats: string[]) {
        this.expectedFormats = expectedFormats
    }

    static isCoerceError(err) {
        return err && err.expectedFormats != undefined
    }
}

/*
 * Built-in formats with defined coercers
 */
export const Format = {
    Number: 'number', // can be int or float, but not NaN or Infinite
    Int: 'int',
    PosInt: 'posint',
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

const Formats = ['number', 'int', 'posint', 'string', 'char', 'boolean']

export function isFormat(value: any) : value is Format {
    if (typeof value === 'string' &&
        Formats.includes(value))
        return true
    return false
}