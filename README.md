![release](https://github.com/fido-id/localvalue-ts/actions/workflows/release.yml/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# localvalue-ts

A small layer over the browser's localstorage, fallbacks to an in-memory store if localstorage is not supported by the browser.

Built on with `fp-ts` in mind, `localvalue-ts` gives you a standard way to access objects stored locally.

## install

### yarn

```shell
yarn add localvalue-ts
```

### npm

```shell
npm install -S localvalue-ts
```

## quick start

First create the hooks to read/write the values you just defined:

First create you codecs:

```tsx
// codecs.ts
import * as t from "io-ts"

export const ThemeFlavourCodec = {
  decode: ...
  encode: ...
}

export const AuthTokenCodec = {
  decode: ...
  encode: ...
}
```

then you use them in your code:

```tsx
// App.tsx
import { ThemeFlavourCodec, AuthTokenCodec } from "./codecs.ts"
import { createLocalStorage } from "localvalue-ts/localStorage"
import * as LV from "localvalue-ts/LocalValue"

const localStorage = createLocalStorage(
  {
    themeFlavour: ThemeFlavourCodec,
    authToken: AuthTokenCodec,
  },
  { defaultValues: { themeFlavour: "light" } },
)

const App = () => {
  const myLocalValue = localStorage.themeFlavour.getValue() // LocalValue<"light" | "dark">

  return pipe(
    theme,
    // N.B. using fold2 because with default value we will never have to deal with missing data
    LV.fold2(
      () => {
        console.error("wrong value stored in localStorage!")
      },
      (themeFlavour) => {
        switch (themeFlavour) {
          case "light": {
            return <LightThemeApp />
          }
          case "dark": {
            return <DarkThemeApp />
          }
        }
      },
    ),
  )
}

export default App
```

## LocalValue

A new data structure is defined for items stored in localstorage, `LocalValue`. When dealing with a value stored in your localstorage there are three possibilities:

1. there is no value in your localstorage (optionality).
2. the value is present, but it is wrong (correctness).
3. the value is present and it is valid (also correctness).

LocalValue introduces a sum type that represents the optionality/correctness dicotomy:

```ts
export interface Absent {
  readonly _tag: "Absent"
}

export interface Invalid<E> {
  readonly _tag: "Invalid"
  readonly errors: E
}
export interface Valid<A> {
  readonly _tag: "Valid"
  readonly value: A
}

export type LocalValue<E, A> = Absent | Invalid<E> | Valid<A>
```

It also has instances for some of the most common type-classes
and you can use it in the same way you usually use your usual `fp-ts` abstractions:

## defining codecs

Given that browsers only allow you to store serialized data in string format, the only accepted codecs are of the form `Codec<E, string, B>`, where `E` is the shape of the decoding error, `B` is the shape of the runtime error and `string` is the type resulting after encoding.

If you use `io-ts` you can simply create a layer to convert `io-ts` codecs to `Codec` compliant instances:

```ts
import { pipe } from "fp-ts/lib/function"
import * as t from "io-ts"
import * as E from "fp-ts/Either"
import { Json, JsonFromString } from "io-ts-types"
import * as LV from "localvalue-ts/LocalValue"
import { Codec } from "localvalue-ts/Codec"

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
```

## contributing

to commit to this repository there are a few rules:

- your commits must follow the conventional commit standard (it should be enforced by husky `commit-msg` hook).
- your code must be formatted using prettier.
- all tests must pass.

## release flow

[here](https://github.com/semantic-release/semantic-release/blob/1405b94296059c0c6878fb8b626e2c5da9317632/docs/recipes/pre-releases.md) you can find an explanation of the release flow.
