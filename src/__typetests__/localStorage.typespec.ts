import * as t from "io-ts"
import { DateFromISOString } from "io-ts-types"
import { fromIoTsCodec } from "../io-ts"
import {
  getLocalElement,
  removeLocalElement,
  setLocalElement,
} from "../localStorage"

const ShapeCodec = t.type({ s: t.string, d: DateFromISOString })
type ShapeCodec = t.TypeOf<typeof ShapeCodec>

const CorrectCodec = fromIoTsCodec(ShapeCodec)

export const defaultShape: ShapeCodec = {
  s: "foo",
  d: new Date(1600732800 * 1000),
}

// @dts-jest:pass:snap It works with string encoding
getLocalElement("sape", CorrectCodec)

// @dts-jest:fail:snap It doesn't work with non-string encoding
getLocalElement("shape", ShapeCodec)

// @dts-jest:pass:snap You can pass a valid set of options
getLocalElement("sape", CorrectCodec, {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

getLocalElement("sape", CorrectCodec, {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  defaultValue: { foo: 123 },
  useMemorySore: false,
})

// @dts-jest:pass:snap It works with string encoding
setLocalElement("sape", CorrectCodec, defaultShape)

// @dts-jest:fail:snap It doesn't work with non-string encoding
setLocalElement("shape", ShapeCodec, defaultShape)

// @dts-jest:pass:snap You can pass a valid set of options
setLocalElement("shape", CorrectCodec, defaultShape, {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

setLocalElement("shape", CorrectCodec, defaultShape, {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  defaultValue: { foo: 123 },
  useMemorySore: false,
})

// @dts-jest:pass:snap It works with any string
removeLocalElement("shape")

// @dts-jest:pass:snap You can pass a valid set of options
removeLocalElement("shape", {
  defaultValue: { s: "foo", d: new Date() },
  useMemorySore: false,
})

removeLocalElement("shape", {
  // @dts-jest:fail:snap You cannot pass an invalid set of options
  useMemorySore: "false",
})
