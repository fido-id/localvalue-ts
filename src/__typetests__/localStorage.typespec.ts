import * as t from "io-ts"
import { DateFromISOString } from "io-ts-types"
import {
  createLocalStorage,
  getLocalValue,
  removeLocalValue,
  setLocalValue,
} from "../localStorage"
import * as E from "fp-ts/Either"
import { Json, JsonFromString } from "io-ts-types"
import { Codec } from "../Codec"
import * as LV from "../LocalValue"
import { pipe } from "fp-ts/lib/function"

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

const ShapeCodec = t.type({ s: t.string, d: DateFromISOString })
type ShapeCodec = t.TypeOf<typeof ShapeCodec>

const CorrectCodec = fromIoTsCodec(ShapeCodec)

export const defaultShape: ShapeCodec = {
  s: "foo",
  d: new Date(1600732800 * 1000),
}

// @dts-jest:pass:snap It works with string encoding
getLocalValue("sape", CorrectCodec)

// @dts-jest:fail:snap It doesn't work with non-string encoding
getLocalValue("shape", ShapeCodec)

// @dts-jest:pass:snap You can pass a valid set of options
getLocalValue("sape", CorrectCodec, {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

getLocalValue("sape", CorrectCodec, {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  defaultValue: { foo: 123 },
  useMemorySore: false,
})

// @dts-jest:pass:snap It works with string encoding
setLocalValue("sape", CorrectCodec, defaultShape)

// @dts-jest:fail:snap It doesn't work with non-string encoding
setLocalValue("shape", ShapeCodec, defaultShape)

// @dts-jest:pass:snap You can pass a valid set of options
setLocalValue("shape", CorrectCodec, defaultShape, {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

setLocalValue("shape", CorrectCodec, defaultShape, {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  defaultValue: { foo: 123 },
  useMemorySore: false,
})

// @dts-jest:pass:snap It works with any string
removeLocalValue("shape")

// @dts-jest:pass:snap You can pass a valid set of options
removeLocalValue("shape", {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

removeLocalValue("shape", {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  useMemorySore: "false",
})

export const UnionCodec = t.union([t.literal("foo"), t.literal("baz")])
const CorrectUnionCodec = fromIoTsCodec(UnionCodec)

const store = createLocalStorage({
  // @dts-jest:pass:snap It works with string encoding
  foo: CorrectCodec,
  union: CorrectUnionCodec,
})

createLocalStorage({
  // @dts-jest:fail:snap It doesn't work with non-string encoding
  foo: ShapeCodec,
})

const storeWithOptions = createLocalStorage(
  {
    foo: CorrectCodec,
    union: CorrectUnionCodec,
  },
  // @dts-jest:pass:snap You can pass a valid set of options to store
  { useMemorySore: true, defaultValues: { foo: defaultShape } },
)

createLocalStorage(
  {
    foo: CorrectCodec,
  },
  // @dts-jest:fail:snap You cannot pass an invalid set of options to store
  { useMemorySore: true, defaultValues: { fo: defaultShape } },
)

// @dts-jest:pass:snap store returns the correct type encoding
store

// @dts-jest:pass:snap store returns the correct type encoding
store.union.getValue()

// @dts-jest:pass:snap storeWithOptions returns the correct type encoding
storeWithOptions

// @dts-jest:pass:snap storeWithOptions returns the correct type encoding
storeWithOptions.union.getValue()
