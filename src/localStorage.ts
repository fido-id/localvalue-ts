import * as O from "fp-ts/Option"
import * as R from "fp-ts/Record"
import { pipe } from "fp-ts/function"
import { localStorageProxy, MemoryStorageProxy } from "./localStorageProxy"
import { Codec, errorType, runtimeType } from "./Codec"
import { LocalValue } from "./LocalValue"
import * as LV from "./LocalValue"

const memoryStore = new MemoryStorageProxy()

export interface LocalStorageOptions<A> {
  useMemorySore?: boolean
  defaultValues?: A
}

interface LocalValueOptions<A> {
  useMemorySore?: boolean
  defaultValue?: A
}

const getStore = (useMemory: boolean) =>
  useMemory ? memoryStore : localStorageProxy

export const getLocalValue = <E, A>(
  t: string,
  codec: Codec<E, string, A>,
  options?: LocalValueOptions<A>,
): LocalValue<E, A> => {
  const store = getStore(options?.useMemorySore ?? false)

  const storedValue = pipe(
    O.fromNullable(store.getItem(t)),
    LV.fromOption,
    LV.chain((v) => codec.decode(v)),
  )

  return options?.defaultValue && !LV.isValid(storedValue)
    ? (LV.valid(options.defaultValue) as LocalValue<E, A>)
    : storedValue
}

export const setLocalValue = <E, A>(
  t: string,
  codec: Codec<E, string, A>,
  v: A,
  options?: LocalValueOptions<A>,
): void => {
  const store = getStore(options?.useMemorySore ?? false)

  store.setItem(t, codec.encode(v))
}

export const removeLocalValue = (
  t: string,
  options?: LocalValueOptions<any>,
): void => {
  const store = getStore(options?.useMemorySore ?? false)
  store.removeItem(t)
}

export type StorageDef<K extends string> = {
  [k in K]: Codec<any, string, any>
}

type StorageInstance<S> = S extends StorageDef<infer K>
  ? {
      [k in K]: {
        getValue: () => LocalValue<errorType<S[K]>, runtimeType<S[K]>>
        setValue: (v: runtimeType<S[K]>) => void
        removeValue: () => void
      }
    }
  : never

export type RuntimeValues<S> = S extends StorageDef<infer K>
  ? { [k in K]: runtimeType<S[K]> }
  : never

const storageOptionsToValueOptions = <
  K extends string,
  SO extends LocalStorageOptions<Record<K, any>> | undefined
>(
  k: K,
  so: SO,
): LocalValueOptions<any> => ({
  useMemorySore: so?.useMemorySore,
  defaultValue:
    so?.defaultValues === undefined
      ? undefined
      : pipe(
          R.lookup(k, so.defaultValues),
          O.getOrElse(() => undefined),
        ),
})

export const createLocalStorage = <S extends StorageDef<any>>(
  storage: S,
  o?: LocalStorageOptions<RuntimeValues<S>>,
): StorageInstance<S> => {
  return pipe(
    storage,
    R.mapWithIndex((k, c) => ({
      getValue: () => getLocalValue(k, c, storageOptionsToValueOptions(k, o)),
      setValue: (v: any) => setLocalValue(k, c, v, o),
      removeValue: () => removeLocalValue(k, o),
    })),
  ) as StorageInstance<S>
}
