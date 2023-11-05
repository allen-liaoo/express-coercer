import lib from "express-coercer"
import NumberTest from "./numbers_test/number.js"
import IntTest from "./numbers_test/int.js"
import PosIntTest from "./numbers_test/pos_int.js"

console.log(lib)

function testCoercer(tests) {
    console.log('=======================')
    console.log(`Test: ${tests.function.name}`)
    for (const v of tests.testset) {
        const input = v[0]
        const shouldSucceed = v[1]
        const printcase = `Testcase: ${input}`
        let print
        try {
            const res = tests.function(input)
            if (!shouldSucceed) {
                print = `Input ${input} should fail but didnt! (Got value ${res})`
            } else if (res !== v[2]) {
                print = `Input ${input} coerced to ${res} but result is not expected! (expected: ${v[2]})`
            }
        } catch (e) {
            if (shouldSucceed) print = `Input ${input} failed but should succeed`
        } finally {
            if (print) console.log(printcase + "\t\t" + print)
        }
    }
    console.log('=======================')
}

// Tests
testCoercer(NumberTest)
testCoercer(IntTest)
testCoercer(PosIntTest)