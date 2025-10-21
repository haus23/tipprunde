/**
 * Creates a singleton instance of a value returned by a factory function.
 *
 * @param key - name for the singleton
 * @param factory - factory function for the value
 * @returns - The singleton value
 */
export function singleton<Value>(key: string, factory: () => Value) {
  const g = (global as typeof globalThis) && {
    __singletons: {} as Record<typeof key, Value>,
  };
  g.__singletons ??= {};

  let instance = g.__singletons[key];
  if (!instance) {
    instance = g.__singletons[key] = factory();
  }
  return instance;
}
