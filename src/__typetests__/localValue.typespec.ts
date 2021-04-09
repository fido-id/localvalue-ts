import * as E from "fp-ts/Either"
import * as LV from "../LocalValue"
import { pipe } from "fp-ts/lib/function"
import { Errors } from "io-ts"

const localValue = LV.fromEither(E.right({ id: "foo" })) as LV.LocalValue<
  Errors,
  { id: string }
>

pipe(
  localValue,
  LV.map(({ id }) => ({ sameID: id })),
  // @dts-jest:fail:snap getOrElse does not let you widen the type
  LV.getOrElse(() => {}),
)

// @dts-jest:pass:snap getOrElseW lets you widen the type
pipe(
  localValue,
  LV.map(({ id }) => ({ sameID: id })),
  LV.getOrElseW(() => {}),
)
