import * as O from "fp-ts/Option"
import * as R from "fp-ts/Record"
import { pipe } from "fp-ts/function"
import { localStorageProxy, MemoryStorageProxy } from "./localStorageProxy"
import { Codec, errorType, runtimeType } from "./Codec"
import { LocalValue } from "./LocalValue"
import * as LV from "./LocalValue"

// -------------------------------------------------------------------------------------
// fp-ts data structures
// -------------------------------------------------------------------------------------

/** @internal */
export interface IO<A> {
  (): A
}

// -------------------------------------------------------------------------------------
// localStorage
// -------------------------------------------------------------------------------------

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
): IO<LocalValue<E, A>> => {
  const store = getStore(options?.useMemorySore ?? false)

  return () => {
    const storedValue = pipe(
      O.fromNullable(store.getItem(t)),
      LV.fromOption,
      LV.chain((v) => codec.decode(v)),
    )

    return options?.defaultValue && !LV.isValid(storedValue)
      ? (LV.valid(options.defaultValue) as LocalValue<E, A>)
      : storedValue
  }
}

export const setLocalValue = <E, A>(
  t: string,
  codec: Codec<E, string, A>,
  v: A,
  options?: LocalValueOptions<A>,
): IO<void> => {
  const store = getStore(options?.useMemorySore ?? false)

  return () => store.setItem(t, codec.encode(v))
}

export const removeLocalValue = (
  t: string,
  options?: LocalValueOptions<any>,
): IO<void> => {
  const store = getStore(options?.useMemorySore ?? false)
  return () => store.removeItem(t)
}

export type StorageDef<K extends string> = {
  [k in K]: Codec<any, string, any>
}

export type LocalValueModifiers<K> = {
  get: IO<LocalValue<errorType<K>, runtimeType<K>>>
  set: (v: runtimeType<K>) => IO<void>
  remove: IO<void>
}

export type StorageInstance<S> = S extends StorageDef<infer K>
  ? {
      [k in K]: LocalValueModifiers<S[k]>
    }
  : never

export type RuntimeValues<S> = S extends StorageDef<infer K>
  ? { [k in K]: runtimeType<S[K]> }
  : never

const storageOptionsToValueOptions = <
  K extends string,
  SO extends LocalStorageOptions<Partial<Record<K, any>>> | undefined
>(
  k: K,
  so: SO,
): LocalValueOptions<any> => ({
  useMemorySore: so?.useMemorySore,
  defaultValue:
    so?.defaultValues === undefined
      ? undefined
      : pipe(
          R.lookup(k, so.defaultValues as Record<K, any>),
          O.getOrElse(() => undefined),
        ),
})

export const createLocalStorage = <S extends StorageDef<any>>(
  storage: S,
  o?: LocalStorageOptions<Partial<RuntimeValues<S>>>,
): StorageInstance<S> => {
  return pipe(
    storage,
    R.mapWithIndex((k, c) => ({
      get: getLocalValue(k, c, storageOptionsToValueOptions(k, o)),
      set: (v: any) => setLocalValue(k, c, v, o),
      remove: removeLocalValue(k, o),
    })),
  ) as StorageInstance<S>
}
