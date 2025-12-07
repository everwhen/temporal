export function invariant(
  condition: unknown,
  message?: string | Error,
): asserts condition {
  if (condition) {
    return
  }

  if (message && typeof message === 'string') {
    throw new Error(message)
  }

  throw message
}
