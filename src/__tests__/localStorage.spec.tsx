import * as t from "io-ts"
import { DateFromISOString } from "io-ts-types"
import {
  setLocalValue,
  getLocalValue,
  removeLocalValue,
  createLocalStorage,
} from "../localStorage"
import * as LV from "../LocalValue"
import { pipe } from "fp-ts/lib/function"
import * as E from "fp-ts/Either"
import { Json, JsonFromString } from "io-ts-types"
import { Codec } from "../Codec"

const adaptIoTsCodec = <A, B>(C: t.Type<B, A>): Codec<t.Errors, A, B> => {
  return {
    encode: C.encode,
    decode: (u: unknown) => LV.fromEither(C.decode(u)),
  }
}

export const fromIoTsCodec = <A, B extends Json>(C: t.Type<A, B>) => {
  const stringCodec = new t.Type<A, string>(
    C.name,
    C.is,
    (u, c) => {
      return pipe(
        t.string.validate(u, c),
        E.chain((jsonString) => JsonFromString.validate(jsonString, c)),
        E.chain((json) => C.validate(json, c)),
      )
    },
    (v) => {
      return pipe(v, C.encode, JsonFromString.encode)
    },
  )

  return adaptIoTsCodec(stringCodec)
}

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
    setLocalValue(localStorageKey, CorrectCodec, defaultShape)

    expect(localStorage.getItem(localStorageKey)).toBe(
      CorrectCodec.encode(defaultShape),
    )

    setLocalValue(localStorageKey, CorrectCodec, {
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
    setLocalValue(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })
})

describe("getLocalElement", () => {
  it("should get values correctly", () => {
    localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

    expect(getLocalValue(localStorageKey, CorrectCodec)).toEqual(
      LV.valid(defaultShape),
    )
  })

  it("returns default value when none is specified", () => {
    const defaultValue = { s: "foo", d: new Date(1650732800 * 1000) }

    expect(
      getLocalValue(localStorageKey, CorrectCodec, {
        defaultValue,
      }),
    ).toEqual(LV.valid(defaultValue))
  })

  it("reads memory store when useMemoryStore=true", () => {
    setLocalValue(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    expect(
      getLocalValue(localStorageKey, CorrectCodec, {
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

    removeLocalValue(localStorageKey)

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })

  it("should be idempotent", () => {
    localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

    expect(localStorage.getItem(localStorageKey)).toEqual(
      CorrectCodec.encode(defaultShape),
    )

    removeLocalValue(localStorageKey)

    removeLocalValue(localStorageKey)

    expect(localStorage.getItem(localStorageKey)).toBeNull()
  })

  it("acts on memory store when useMemorySore=true", () => {
    setLocalValue(localStorageKey, CorrectCodec, defaultShape, {
      useMemorySore: true,
    })

    removeLocalValue(localStorageKey, { useMemorySore: true })

    expect(
      getLocalValue(localStorageKey, CorrectCodec, {
        useMemorySore: true,
      }),
    ).toEqual(LV.absent)
  })
})

describe("createLocalStorage", () => {
  const store = createLocalStorage({
    [localStorageKey]: CorrectCodec,
  })

  describe("setValues", () => {
    it("should set values correctly", () => {
      store.shape.setValue(defaultShape)

      expect(localStorage.getItem(localStorageKey)).toBe(
        CorrectCodec.encode(defaultShape),
      )

      store.shape.setValue({
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
      const store = createLocalStorage(
        {
          [localStorageKey]: CorrectCodec,
        },
        {
          useMemorySore: true,
        },
      )

      store.shape.setValue(defaultShape)

      expect(localStorage.getItem(localStorageKey)).toBeNull()
    })
  })

  describe("getValues", () => {
    it("should get values correctly", () => {
      const store = createLocalStorage({
        [localStorageKey]: CorrectCodec,
      })

      localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

      expect(store.shape.getValue()).toEqual(LV.valid(defaultShape))
    })

    it("returns default value when none is specified", () => {
      const defaultValue = { s: "foo", d: new Date(1650732800 * 1000) }
      const store = createLocalStorage(
        {
          [localStorageKey]: CorrectCodec,
        },
        { defaultValues: { [localStorageKey]: defaultValue } },
      )
      expect(store.shape.getValue()).toEqual(LV.valid(defaultValue))
    })

    it("reads memory store when useMemoryStore=true", () => {
      setLocalValue(localStorageKey, CorrectCodec, defaultShape, {
        useMemorySore: true,
      })
      const store = createLocalStorage(
        {
          [localStorageKey]: CorrectCodec,
        },
        { useMemorySore: true },
      )

      expect(store.shape.getValue()).toEqual(LV.valid(defaultShape))
    })
  })

  describe("removeValues", () => {
    it("should remove values correctly", () => {
      const store = createLocalStorage({
        [localStorageKey]: CorrectCodec,
      })

      localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

      expect(localStorage.getItem(localStorageKey)).toEqual(
        CorrectCodec.encode(defaultShape),
      )

      store.shape.removeValue()

      expect(localStorage.getItem(localStorageKey)).toBeNull()
    })

    it("should be idempotent", () => {
      const store = createLocalStorage({
        [localStorageKey]: CorrectCodec,
      })

      localStorage.setItem(localStorageKey, CorrectCodec.encode(defaultShape))

      expect(localStorage.getItem(localStorageKey)).toEqual(
        CorrectCodec.encode(defaultShape),
      )

      store.shape.removeValue()

      store.shape.removeValue()

      expect(localStorage.getItem(localStorageKey)).toBeNull()
    })

    it("act on memory store when useMemorySore=true", () => {
      const store = createLocalStorage(
        {
          [localStorageKey]: CorrectCodec,
        },
        { useMemorySore: true },
      )

      store.shape.setValue(defaultShape)

      store.shape.removeValue()

      expect(store.shape.getValue()).toEqual(LV.absent)
    })
  })
})
