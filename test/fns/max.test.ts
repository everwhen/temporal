import { describe, expect, it } from 'vitest'
import { max } from '../../src/fn/max.ts'
import { PlainDate } from '../../src/plain-date.ts'

describe('max', () => {
  it('returns the larger of a set of supplied temporal points', () => {
    const date = max(
      PlainDate.from('2025-03-05'),
      PlainDate.from('2025-03-06'),
      PlainDate.from('2025-04-03'),
      PlainDate.from('2023-02-01'),
    )
    expect(date.toString()).toBe('2025-04-03')
  })
})
