export const storeChangedCustomEvent = "storeChangedCustomEvent"

export function localStorageAvailable(): boolean {
  try {
    const x = "react-local-storage-test:" + new Date().toISOString()
    localStorage.setItem(x, x)
    localStorage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage &&
      localStorage.length !== 0
    )
  }
}

export interface LocalStorageChangedEvent {
  detail: { key: string }
}

interface LocalStorageChangedEventPayload {
  key: string
}
const createLocalStorageChangedEvent = (
  key: string,
): CustomEvent<LocalStorageChangedEventPayload> => {
  return new CustomEvent(storeChangedCustomEvent, { detail: { key } })
}

/** @internal */
export const isLocalStorageEvent = (e: any): e is LocalStorageChangedEvent => {
  return typeof e?.detail?.key === "string"
}

const dispatchCustomEvent = (key: string) =>
  window.dispatchEvent(createLocalStorageChangedEvent(key))

interface IProxyStorage {
  getItem(key: string): string | null
  setItem(Key: string, value: string): void
  removeItem(key: string): void
}

/** @internal */
export class LocalStorageProxy implements IProxyStorage {
  getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
    dispatchCustomEvent(key)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
    dispatchCustomEvent(key)
  }
}

/** @internal */
export class MemoryStorageProxy implements IProxyStorage {
  private _memoryStorage = new Map<string, string>()

  getItem(key: string): string | null {
    return this._memoryStorage.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this._memoryStorage.set(key, value)
    dispatchCustomEvent(key)
  }

  removeItem(key: string): void {
    this._memoryStorage.delete(key)
    dispatchCustomEvent(key)
  }
}

/** @internal */
export const localStorageProxy: IProxyStorage = localStorageAvailable()
  ? new LocalStorageProxy()
  : new MemoryStorageProxy()
