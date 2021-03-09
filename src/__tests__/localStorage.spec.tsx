import * as t from "io-ts"
import { DateFromISOString } from "io-ts-types"
import {
  setLocalElement,
  getLocalElement,
  removeLocalElement,
} from "../localStorage"
import { fromIoTsCodec } from "../io-ts"
import * as LV from "../LocalValue"

export const localStorageKey = "shape"

export const ShapeCodec = t.type({ s: t.string, d: DateFromISOString })
export type ShapeCodec = t.TypeOf<typeof ShapeCodec>

export const defaultShape: ShapeCodec = {
  s: "foo",
  d: new Date(1600732800 * 1000),
}

const CorrectCodec = fromIoTsCodec(ShapeCodec)

afterEach(() => {
  localStorage.clear()
})

describe("setLocalElement", () => {
  it("should set values correctly", () => {
    setLocalElement(localStorageKey, CorrectCodec, defaultShape)

    expect(localStorage.getItem(localStorageKey)).toBe(
      CorrectCodec.encode(defaultShape),
    )

    setLocalElement(localStorageKey, CorrectCodec, {
      ...defaultShape,
      s: "baz",
    })

    expect(localStorage.getItem(localStorageKey)).toBe(
      CorrectCodec.encode({
        ...defaultShape,
        s: "baz",
      }),
    )
  })

  it("does not write on localStorage when useMemorySore=true", () => {
    setLocalElement(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })
})

describe("getLocalElement", () => {
  it("should get values correctly", () => {
    localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

    expect(getLocalElement(localStorageKey, CorrectCodec)).toEqual(
      LV.valid(defaultShape),
    )
  })

  it("returns default value when none is specified", () => {
    const defaultValue = { s: "foo", d: new Date(1650732800 * 1000) }

    expect(
      getLocalElement(localStorageKey, CorrectCodec, {
        defaultValue,
      }),
    ).toEqual(LV.valid(defaultValue))
  })

  it("reads memory store when useMemoryStore=true", () => {
    setLocalElement(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    expect(
      getLocalElement(localStorageKey, CorrectCodec, {
        useMemorySore: true,
      }),
    ).toEqual(LV.valid(defaultShape))
  })
})

describe("removeLocalElement", () => {
  it("should remove values correctly", () => {
    localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

    expect(localStorage.getItem(localStorageKey)).toEqual(
      CorrectCodec.encode(defaultShape),
    )

    removeLocalElement(localStorageKey)

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })

  it("should be idempotent", () => {
    localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

    expect(localStorage.getItem(localStorageKey)).toEqual(
      CorrectCodec.encode(defaultShape),
    )

    removeLocalElement(localStorageKey)

    removeLocalElement(localStorageKey)

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })

  it("act on memory store when useMemorySore=true", () => {
    setLocalElement(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    removeLocalElement(localStorageKey, { useMemorySore: true })

    expect(
      getLocalElement(localStorageKey, CorrectCodec, {
        useMemorySore: true,
      }),
    ).toEqual(LV.absent)
  })
})
