import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import { localStorageProxy, MemoryStorageProxy } from "./localStorageProxy"
import { Codec } from "./Codec"
import { LocalValue } from "./LocalValue"
import * as LV from "./LocalValue"

const memoryStore = new MemoryStorageProxy()

export interface LocalItemOptions<A> {
  useMemorySore?: boolean
  defaultValue?: A
}

const getStore = <O extends LocalItemOptions<any>>(o?: O) =>
  o?.useMemorySore ?? false ? memoryStore : localStorageProxy

export const getLocalElement = <E, A>(
  t: string,
  codec: Codec<E, string, A>,
  options?: LocalItemOptions<A>,
): LocalValue<E, A> => {
  const store = getStore(options)

  const storedValue = pipe(
    O.fromNullable(store.getItem(t)),
    LV.fromOption,
    LV.chain((v) => codec.decode(v)),
  )

  return options?.defaultValue && !LV.isValid(storedValue)
    ? (LV.valid(options.defaultValue) as LocalValue<E, A>)
    : storedValue
}

export const setLocalElement = <E, A>(
  t: string,
  codec: Codec<E, string, A>,
  v: A,
  options?: LocalItemOptions<A>,
): void => {
  const store = getStore(options)

  store.setItem(t, codec.encode(v))
}

export const removeLocalElement = (
  t: string,
  options?: LocalItemOptions<any>,
): void => {
  const store = getStore(options)
  store.removeItem(t)
}
