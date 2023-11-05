// Turns "true" to true and "false" to false
// This is the default
export function strictStringToBoolean(value: any) : boolean {
    return value === "true"
}

// converts any value to boolean the Javascript(TM) way
export function anyToBoolean(value: any) : boolean {
    return !!value
}