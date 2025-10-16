import { describe, expect, it } from 'vitest'
import { min } from '../../src/fn/min.ts'
import { PlainDate } from '../../src/plain-date.ts'

describe('min', () => {
  it('returns the smaller of a set of supplied temporal points', () => {
    const date = min(
      PlainDate.from('2025-03-05'),
      PlainDate.from('2025-03-06'),
      PlainDate.from('2025-04-03'),
      PlainDate.from('2023-02-01'),
    )
    expect(date.toString()).toBe('2023-02-01')
  })
})
