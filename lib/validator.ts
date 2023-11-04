import { Types } from "./defaults"

// RequestLocation acts like an enum or an union type of strings
// To refer to the Body location, either RequestLocation.Body or "body" is accepted
export const RequestLocation = {
    Body: "body",      // request body
    Query: "query",    // query parameter
    Params: "params",   // routing parameter,
    All: "all"
} as const
// as const makes the type expression specific enough to include the literal strings

export type RequestLocation = typeof RequestLocation[
    // keyof creates a union type from keys
    keyof typeof RequestLocation
]
// we take those keys as strings, and do a lookup to find its values which we set as the type

/*
location: location to find value to validate (default: RequestLocation.All)
name: the name of the value to coerce/validate
required: whether value is required (default: false)
type: string of expected type (default: null).
checkers: the coercer function to use. Default to no function if type is not specified, 
    or if type is specified and primitive, a default coercer corresponding to the primitive type is called (See default functions)
recursive: whether to recursively search for any variable with the name (used in objects)
*/
// export function validate({
//     location: RequestLocation,
//     name: string,
//     coerce: boolean = false,
//     required: boolean = false,
// }) {
// }


export function getDefaultValidator(type: Types) : (value: any) => unknown {
    switch (type) {
        case Types.Int: 
        case Types.Boolean: 
        default: return (e) => e    // identity function
    }
}