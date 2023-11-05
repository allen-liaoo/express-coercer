import { ExpressCoercer } from "./expressCoercer"
// To refer to req.body location, either TargetLocation.Body or "body" is accepted
export const SearchLocation = {
    Body: 'body',
    Query: 'query',
    Params: 'params',
    All: 'all'
} as const
// as const makes the type expression specific enough to include the literal strings

export type SearchLocation = typeof SearchLocation[
    // keyof creates a union type from keys
    keyof typeof SearchLocation
]
// we take those keys as strings, and do a lookup to find its values which we set as the type
// Target acts like an enum or an union type of strings

const SearchLocations = ['body', 'query', 'params', 'all']

export function isTargetLocation(value: any) : value is SearchLocation {
    if (typeof value === 'string' &&
        SearchLocations.includes(value))
        return true
    return false
}

/*
locations: location to find value to validate (default: TargetLocation.All)
recDepth: the depth to do the recursive search (default: 0). 
    recDepth decrements by 1 everytime the searching function enters a nested object.
    If recDepth > 0, then the recursive search will enter exactly "recDepth" levels of nested objects
    If recDepth = 0, then the search is not recursive
    If recDepth < 0, then there is no limit to the depth of the recursion.
    The search stops after encountering all nested objects. Be careful of cyclical objects as the search will not terminate
targets: names of the value to look for. It can be an array of strings or a string.
    If targets is falsey ("", [], null, undefined), the coercer is used on all applicable values
searchArray: whether to step into arrays and search each element for a target (default: ignores arrays, false)
    Stepping into an array does not decrement recDepth. 
    However, if the array is an array of objects, then stepping into an object element decrements recDepth
TODO: checkCycle: (result: boolean) => void | undefined
*/
export interface SearchOptions {
    locations?: SearchLocation | SearchLocation[] | object | object[],
    targets?: string | string[],
    recDepth?: number, 
    searchArray?: boolean
}

/* Middleware */
export function search(options: SearchOptions) {
    // Construct and validate search options
    const searchOptions: Required<SearchOptions> = {
        locations: SearchLocation.All,
        targets: [],    // cannot be undefined since type is Required<T>
        recDepth: 0,
        searchArray: false,
        ...options      // override defaults with user defined options
    }

    if (!Number.isInteger(searchOptions.recDepth)) {
        throw "express-coercer: rec_depth must be an integer!"
    }

    // Turn targets into an array of strings
    const targets = buildTargets(searchOptions.targets)
    console.log(`targets: ${JSON.stringify(targets, undefined, " ")}`)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    return function(req: any, res: any, next: Function) {
        // The following code are request-dependent
        if (req.expressCoercer != null) {
            throw "express-coercer: Cannot start a new search for coercion/validation when previous search has not ended!"
        }

        // build search target objects
        const searchLocations = buildSearchLocations(searchOptions.locations, req)
        console.log(`Search locations: ${JSON.stringify(searchLocations)}`)

        // build search function
        const searchRec = buildSearchFunction(searchLocations, targets, searchOptions)

        const expressCoercer: ExpressCoercer = {
            searchOptions: searchOptions,
            searchLocations: searchLocations,
            search: searchRec
        }
        req.expressCoercer = expressCoercer
        next()
    }
}

export function cleanup(req, res, next) {
    req.expressCoercer = undefined
    next()
}

// Turn targets union type into an array of strings
function buildTargets(targets: string | string[]): string[] {
    if (Array.isArray(targets)) return targets
    return [targets]
}

function buildSearchLocations(targets: SearchLocation | SearchLocation[] | object | object[], req: any): object[] {
    // turnn targets into an array of object references
    let searchLocations: any[] = [];
    if (!Array.isArray(targets)) {
        searchLocations = [targets]
    } else {
        searchLocations = targets
    }

    // Replace SearchLocations with object
    for (let i = 0; i < searchLocations.length; i++) {
        const t = searchLocations[i]
        console.log(`Replacing locations: ${t}`)
        if (isTargetLocation(t)) {
            if (t === 'all') {
                searchLocations.splice(i,       // start in-place
                    1,                          // remove 'all'
                    SearchLocation.Body,        // replace "all" with the three targets
                    SearchLocation.Query,
                    SearchLocation.Params)
                i--     // don't increment i, redo this step at the same i
            } else {
                // replace targets with their corresponding object in the request
                searchLocations[i] = req[t]
            }
        }
    }
    return searchLocations
}

// Returns the search function, which takes a callback of the type (value: any) => any
function buildSearchFunction(targetLocations: object[], targets: string[], searchOptions: Required<SearchOptions>) {
    // hasLimit is true if there is a limit to recurisve depth
    const hasLimit = (searchOptions.recDepth < 0) ? false : true
    // noTargets is true if no targets specified--so every value is a target
    const noTargets = !targets || (targets.length === 0)

    function searchObject(obj: object, callback: Function, recDepth: number) {
        // If we reached recDepth and there is limit to recursion
        // Check if < 0 since if = 0, we still need to search once
        if (recDepth < 0 && hasLimit) return

        console.log(`Searching object with depth ${recDepth}: ${JSON.stringify(obj, undefined, " ")}`)
        for (const key in obj) {
            const value = obj[key]
            // Found target
            // Either key matches a target's name
            // Or no targets specified, and value is not an object nor array
            if (targets.includes(key) ||
                (noTargets && typeof value !== 'object' && !Array.isArray(value))) {
                console.log(`Found: ${key}, ${value}`)
                callback(value)
            }

            if (searchOptions.searchArray && Array.isArray(value)) searchArray(value, callback, recDepth)
            if (isPureObject(value)) searchObject(value, callback, recDepth-1)
        }
    }

    function searchArray(array: any[], callback: Function, recDepth: number) {
        for (const value of array) {
            if (isPureObject(value)) searchObject(value, callback, recDepth-1)
            else if (searchOptions.searchArray && Array.isArray(value)) searchArray(value, callback, recDepth)
        }
    }

    return function searchRec(callback: Function) : any {
        for (const obj of targetLocations) {
            searchObject(obj, callback, searchOptions.recDepth)
        }
    }
}

// helper to check if a value is a pure js object
// returns false for arrays, functions, Number, String, etc.
function isPureObject(value: any): boolean {
    return null !== value
        && typeof value === 'object'
        // eslint-disable-next-line no-prototype-builtins
        && Object.getPrototypeOf(value).isPrototypeOf(Object);
}