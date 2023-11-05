
/*
required: whether value is required (default: false)
*/
export interface ValidatorOptions {
    required?: boolean
}

const defaultValidatorOptions: ValidatorOptions = {
    required: false
}

/*

*/
export function validate(options?: ValidatorOptions) {
    const ops: ValidatorOptions = {
        ...defaultValidatorOptions,   // supply default values
        ...options                  // then override them with user provided options
    }
}