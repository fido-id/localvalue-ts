![release](https://github.com/fido-id/localstorage-ts/actions/workflows/release.yml/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# localstorage-ts

A small layer over the browser's localstorage, fallbacks to an in-memory store if localstorage is not supported by the browser.

Built on with `fp-ts` in mind, `localstorage-ts` gives you a standard way to access objects stored locally.

## install

### yarn

```shell
yarn add localstorage-ts
```

### npm

```shell
npm install -S localstorage-ts
```

## quick start

First create the hooks to read/write the values you just defined:

First create you codecs:

```tsx
// codecs.ts
import * as t from "io-ts"
import { fromIoTsCodec } from "localstorage-ts/io-ts"

const ThemeFlavourC = t.union([t.literal("dark"), t.literal("light")])

export const ThemeFlavour = fromIoTsCodec(ThemeFlavourC)
```

then you use them in your code:

```tsx
// App.tsx
import { ThemeFlavour } from "./codecs.ts"
import {
  getLocalElement,
  removeLocalElement,
  setLocalElement,
} from "localstorage-ts/localStorage"
import * as LV from "localstorage-ts/LocalValue"

const App = () => {
  const myLocalValue = getLocalElement("themeFlavour", ThemeFlavour, {
    defaultValue: "light",
  })

  return pipe(
    theme,
    LV.fold2(
      // N.B. using fold2 because with default value we will never have to deal with missing data
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

## contributing

to commit to this repository there are a few rules:

- your commits must follow the conventional commit standard (it should be enforced by husky `commit-msg` hook).
- your code must be formatted using prettier.
- all tests must pass.

## release flow

[here](https://github.com/semantic-release/semantic-release/blob/1405b94296059c0c6878fb8b626e2c5da9317632/docs/recipes/pre-releases.md) you can find an explanation of the release flow.
