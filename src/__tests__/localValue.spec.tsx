import * as O from "fp-ts/Option"
import * as E from "fp-ts/Either"
import {
    fold,
    fold2,
    Absent,
    invalid,
    valid,
    getOrElse,
    getOrElseW,
    of,
    chain,
    map,
    fromOption,
    fromEither,
    alt,
    isValid,
    isInvalid,
    isAbsent

} from "../LocalValue"
import {random} from "fp-ts";

const absent = (): Absent => ({_tag: "Absent"})

describe("fold", () => {
    const onNone = () => 'on_none'
    const onError = (errors: string) => errors
    const onValue = (value: string) => value

    it("returns none if absent", () => {
        expect(fold(onNone, onError, onValue)(absent())).toEqual(onNone())
    })

    it("returns error if invalid", () => {
        const errors = random.random().toString()

        expect(fold(onNone, onError, onValue)(invalid(errors))).toEqual(onError(errors))
    })

    it("return the value if valid", () => {
        const value = random.random().toString()

        expect(fold(onNone, onError, onValue)(valid(value))).toEqual(onValue(value))
    })
})

describe("fold2", () => {
    const onError = (errors?: string) => errors
    const onValue = (value: string) => value

    it("returns error if invalid or absent", () => {
        const errors = random.random().toString()

        expect(fold2(onError, onValue)(invalid(errors))).toEqual(onError(errors))
        expect(fold2(onError, onValue)(absent())).toEqual(onError())
    })

    it("return the value if valid", () => {
        const value = random.random().toString()
        expect(fold2(onError, onValue)(valid(value))).toEqual(onValue(value))
    })
})

describe("getOrElse (same type default)", () => {
    const defaultValue = (value?: string) => value

    it("returns the default value if invalid or absent", () => {
        const errors = random.random().toString()

        expect(getOrElse(defaultValue)(invalid(errors))).toEqual(defaultValue())
        expect(getOrElse(defaultValue)(absent())).toEqual(defaultValue())
    })

    it("return the value if found", () => {
        const value = random.random().toString()
        expect(getOrElse(defaultValue)(valid(value))).toEqual(value)
    })
})

describe("getOrElseW (type widening)", () => {
    const defaultValue = () => true

    it("returns the default value if invalid or absent", () => {
        const errors = random.random().toString()

        expect(getOrElseW(defaultValue)(invalid(errors))).toEqual(defaultValue())
        expect(getOrElseW(defaultValue)(absent())).toEqual(defaultValue())
    })

    it("return the value if found", () => {
        const value = random.random().toString()

        expect(getOrElseW(defaultValue)(valid(value))).toEqual(value)
    })
})

describe("of ", () => {
    it("always return a valid value", () => {
        const value = random.random().toString()

        expect(of(value)).toEqual(valid(value))
    })
})

describe("chain", () => {
    it("extract the value if is valid, the localValue otherwise", () => {

        const any_value = random.random().toString()

        const a_function = (a: any) => a

        expect(chain(a_function)(invalid(any_value))).toEqual(invalid(any_value))
        expect(chain(a_function)(absent())).toEqual(absent())
        expect(chain(a_function)(valid(any_value))).toEqual(any_value)
    })
})

describe("map", () => {
    it("return the value as a VALID type, the localValue otherwise", () => {

        const any_value = random.random().toString()

        const a_remapping_function = (a: any) => ({remapped: a})

        expect(map(a_remapping_function)(invalid(any_value))).toEqual(invalid(any_value))
        expect(map(a_remapping_function)(absent())).toEqual(absent())
        expect(map(a_remapping_function)(valid(any_value))).toEqual(valid(a_remapping_function(any_value)))
    })
})

describe("fromOption", () => {
    it("map some and none into valid invalid", () => {
        const any_value = random.random().toString()

        const some = O.fromNullable(any_value)
        const none = O.fromNullable(undefined)

        expect(fromOption(none)).toEqual(absent())
        expect(fromOption(some)).toEqual(valid(any_value))
    })
})

describe("fromEither", () => {
    it("map either into valid if right, invalid if left", () => {

        const left = random.random().toString()
        const right = random.random().toString()

        const some = E.fromNullable(left)(right)
        const none = E.fromNullable(left)(undefined)

        expect(fromEither(some)).toEqual(valid(right))
        expect(fromEither(none)).toEqual(invalid(left))
    })
})


describe("alt", () => {
    it("return left or right if the value is valid", () => {
        const any_value = random.random().toString()
        const valid_value = valid(any_value)
        const invalid_value = invalid(any_value)

        expect(alt(() => valid_value)(invalid_value)).toEqual(invalid_value)
        expect(alt(() => valid_value)(valid_value)).toEqual(valid_value)
    })
})

describe("isAbsent/isValid/isInvalid", () => {
    it("return true if is valid", () => {
        const any_value = random.random().toString()
        expect(isValid(valid(any_value))).toBeTruthy()
        expect(isValid(invalid(any_value))).toBeFalsy()
    })

    it("return true if is invalid", () => {
        const any_value = random.random().toString()
        expect(isInvalid(invalid(any_value))).toBeTruthy()
        expect(isInvalid(valid(any_value))).toBeFalsy()
    })

    it("return true if is absent", () => {
        const any_value = random.random().toString()
        expect(isAbsent(absent())).toBeTruthy()
        expect(isAbsent(valid(any_value))).toBeFalsy()
    })
})



