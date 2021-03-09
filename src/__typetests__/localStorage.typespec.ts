import * as t from "io-ts"
import { DateFromISOString } from "io-ts-types"
import { fromIoTsCodec } from "../io-ts"
import {
  createLocalStorage,
  getLocalValue,
  removeLocalValue,
  setLocalValue,
} from "../localStorage"

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

const store = createLocalStorage({
  // @dts-jest:pass:snap It works with string encoding
  foo: CorrectCodec,
})

createLocalStorage({
  // @dts-jest:fail:snap It doesn't work with non-string encoding
  foo: ShapeCodec,
})

const storeWithOptions = createLocalStorage(
  {
    foo: CorrectCodec,
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

// @dts-jest:pass:snap storeWithOptions returns the correct type encoding
storeWithOptions
