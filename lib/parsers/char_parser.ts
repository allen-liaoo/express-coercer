import { NotParsable } from "./parser"

export function intToChar(value: any) : string {
    try {
        return String.fromCharCode(value)
    } catch (e) {
        throw NotParsable("char", value)
    }
}