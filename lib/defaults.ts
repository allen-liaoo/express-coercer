export const Types = {
    Number: "number", // can be int or float, but not NaN or Infinite
    Int: "int",
    PosInt: "positive int",
    String: "string",
    Char: "char",
    Boolean: "boolean"
} as const
// as const makes the type expression specific enough to include the literal strings

export type Types = typeof Types[
    // keyof creates a union type from keys
    keyof typeof Types
]
// we take those keys as strings, and do a lookup to find its values which we set as the type