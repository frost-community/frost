export function isPromise(x: unknown): x is Promise<unknown> {
  return x instanceof Promise || (x != null && typeof (x as any).then === 'function');
}
