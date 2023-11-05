import { SearchOptions } from "./searcher"

export interface ExpressCoercer {
    searchOptions: Required<SearchOptions>,
    searchLocations: object[],
    // eslint-disable-next-line @typescript-eslint/ban-types
    search: Function
}