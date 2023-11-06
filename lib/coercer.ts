import { getCoercerByFormat } from './default_coercers'
import { CoerceResult, CoercerFunction, Format, isFormat } from './types'

/*
 * coercers: Either a Format, a Format array, a function, or a functions array
 * 1. If coercers is a Format or a Format array: 
 *      The default parser for the corresponding format(s) is used (See getDefaultParser())
 * 2. If coercers is a function or a list of functions:
 *      A function should either coerces the value to some format, leave it unchanged, or throws a CoerceError
 *      The functions are called in the order that they are listed.
*/
export function coerce(coercers: Format | Format[] | CoercerFunction | CoercerFunction[]) {
    if (!coercers) {
        throw "express-coercer: Must provide coercers to the coerce function!"
    }

    // Turn coercers into type Function[]
    const coercerFuncs: any[] = buildCoercers(coercers)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    return function(req, res, next) {
        // ignore this if no search is set up
        if (!req.coercer) {
            next()
            return
        }

        // initialize coercer results array
        const results = req.coercer.results
        if ((!results || !Array.isArray(results)))  // if results is not set or not an array
            req.coercer.results = []

        // For each coercer, run the function and set the coercer result
        for (const func of coercerFuncs) {
            // wrap each coercer func inside a function that sets coerceresult
            req.coercer.search((targetName: string, value: any) => {
                // initialize coerceResult
                const coerceRes: CoerceResult = {
                    success: true,
                    key: targetName,
                    before: value,
                    coercer: func
                }

                try {
                    // call coercer
                    const res = func(value)
                    coerceRes.after = res
                } catch (err) {
                    // catch CoerceError, set corresponding results
                    coerceRes.success = false
                    coerceRes.error = err
                }

                req.coercer.results.push(coerceRes)
                return coerceRes.after == undefined ? coerceRes.before : coerceRes.after
                // ensures that if coercer fails, then value is unchanged
            })
        }
        next()
    }
}

// Turn coercers into a Functions array
function buildCoercers(coercers: Format | Format[] | CoercerFunction | CoercerFunction[]) {
    let coercerFuncs: any[]
    if (!Array.isArray(coercers)) coercerFuncs = [coercers]
    else coercerFuncs = coercers
    coercerFuncs = coercerFuncs.map((e) => {
        if (isFormat(e)) return getCoercerByFormat(e)
        return e
    })
    return coercerFuncs
}