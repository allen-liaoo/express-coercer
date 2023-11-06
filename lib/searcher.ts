import { ExpressCoercer } from "./types"

/*
 * The input object to look for associated with the request
 * Body: request.body (request body)
 * Query: request.query (query parameter)
 * Params: request.params (routing parameter)
 * All: All of the above
 */
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
// SearchLocation acts like an enum or an union type of strings

const SearchLocations = ['body', 'query', 'params', 'all']

function isSearchLocation(value: any) : value is SearchLocation {
    if (typeof value === 'string' &&
        SearchLocations.includes(value))
        return true
    return false
}

/*
 * Options for searching (see search())
 */
export interface SearchOptions {
    locations?: SearchLocation | SearchLocation[] | object | object[],
    keys?: string | string[],
    recDepth?: number, 
    searchArray?: boolean
}

export type SearchCallback = (keyName: string, value: any) => any

/* Middleware */
/*
 * The searcher provides mechanisms to find values to coerce.
 * Use this function prior to the other middlewares to initialize the mechanisms for coercion
 * Call this sets up the req.coercer object used by coerce(). 
 * If a req.coercer object is already present, it is overriden (except for its results).
 * It implicitly has two modes:
 * 1. Key mode – Searches for any object with a certain key name
 * 2. No-Key mode – Iterates through any value in objects or arrays
 * 
 * options is a SearchOption, which include the following fields:
 * locations: location to find value to validate (default: SearchLocation.All, which includes request's body, query, and param)
 * recDepth: the depth to do the recursive search (default: -1), decrements by 1 everytime the searching function enters a nested object.
 *      1. If recDepth > 0, then the recursive search will enter exactly "recDepth" levels of nested objects
 *      2. If recDepth = 0, then the search is not recursive
 *      3. If recDepth < 0, then there is no limit to the depth of the recursion.
 *         The search stops after encountering all nested objects. Be careful of cyclical objects as the search will not terminate.
 * keys: names of the value to look for. It can be an array of strings or a string.
 *      If keys is falsey ("", [], null, undefined), searcher is in the No-Key mode
 * searchArray: whether to step into arrays and search each element for a key (default: true)
 *      Stepping into an array does not decrement recDepth. 
 *      However, if the array is an array of objects, then stepping into an object element decrements recDepth
*/
// TODO: checkCycle: (result: boolean) => void | undefined
export function search(options: SearchOptions) {
    // Construct and validate search options
    const searchOptions: Required<SearchOptions> = {
        locations: SearchLocation.All,
        keys: [],    // cannot be undefined since type is Required<T>
        recDepth: -1,
        searchArray: true,
        ...options      // override defaults with user defined options
    }

    if (!Number.isInteger(searchOptions.recDepth)) {
        throw "express-coercer: recDepth must be an integer!"
    }

    // Turn keys into an array of strings
    const keys = buildKeys(searchOptions.keys)
    // console.log(`keys: ${JSON.stringify(keys, undefined, " ")}`)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    return function(req, res, next) {
        // The following code are request-dependent
        // build search locations
        const searchLocations = buildSearchLocations(searchOptions.locations, req)
        // console.log(`Search locations: ${JSON.stringify(searchLocations)}`)

        // build search function
        const searchRec = buildSearchFunction(searchLocations, keys, searchOptions)

        const coercer: ExpressCoercer = {
            searchOptions: searchOptions,
            searchLocations: searchLocations,
            search: searchRec,
            results: req?.coercer?.results   // preserves previous results
        }

        req.coercer = coercer   // might override a previous coercer object
        next()
    }
}

// Turn keys union type into an array of strings
function buildKeys(keys: string | string[]): string[] {
    if (Array.isArray(keys)) return keys
    return [keys]
}

function buildSearchLocations(keys: SearchLocation | SearchLocation[] | object | object[], req: any): object[] {
    // turnn keys into an array of object references
    let searchLocations: any[] = [];
    if (!Array.isArray(keys)) {
        searchLocations = [keys]     // singleton array with reference to keys
    } else {
        searchLocations = [...keys]
        // clones keys array, where each element is copied by reference
    }   // we want to copy each element by reference so that they point to the same object

    // Replace SearchLocations with object
    for (let i = 0; i < searchLocations.length; i++) {
        const t = searchLocations[i]
        // console.log(`Replacing locations: ${t}`)
        if (isSearchLocation(t)) {
            if (t === 'all') {
                searchLocations.splice(i,       // start in-place
                    1,                          // remove 'all'
                    SearchLocation.Body,        // replace "all" with the three keys
                    SearchLocation.Query,
                    SearchLocation.Params)
                i--     // don't increment i, redo this step at the same i
            } else {
                // replace keys with their corresponding object in the request
                searchLocations[i] = req[t]
            }
        }
    }
    return searchLocations
}

// Returns the search function, which takes a callback of the type (value: any) => any
function buildSearchFunction(searchLocations: object[], keys: string[], searchOptions: Required<SearchOptions>) {
    // hasLimit is true if there is a limit to recurisve depth
    const hasLimit = (searchOptions.recDepth < 0) ? false : true
    // noKeys is true if no keys specified--so every value matches the search
    const noKeys = !keys || (keys.length === 0)

    function searchObject(obj: object, callback: SearchCallback, recDepth: number) {
        // If we reached recDepth and there is limit to recursion
        // Check if < 0 since if = 0, we still need to search once
        if (recDepth < 0 && hasLimit) return

        // console.log(`Searching object with depth ${recDepth}: ${JSON.stringify(obj, undefined, " ")}`)
        for (const key in obj) {
            const value = obj[key]
            // Found key
            // Either key matches a key's name
            // Or no keys specified, and value is not an object nor array
            if (keys.includes(key) ||
                (noKeys && typeof value !== 'object')) {
                // console.log(`Found: ${key}, ${value}`)
                obj[key] = callback(key, value)
            }

            if (searchOptions.searchArray && Array.isArray(value)) searchArray(value, callback, recDepth)
            if (isPureObject(value)) searchObject(value, callback, recDepth-1)
        }
    }

    function searchArray(array: any[], callback: SearchCallback, recDepth: number) {
        for (let i = 0; i < array.length; i++) {
            const value = array[i]
            if (isPureObject(value))
                searchObject(value, callback, recDepth-1)
            else if (searchOptions.searchArray && Array.isArray(value))
                searchArray(value, callback, recDepth)
            else if (noKeys)
                array[i] = callback('', value)
        }
    }

    return function searchRec(callback: SearchCallback) : void {
        for (const obj of searchLocations) {
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