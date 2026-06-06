import { describe, it, expect } from 'vitest'
import { calculateArrivalDate, calculateCurrentWeek } from './pregnancy'

describe('Pregnancy calculations utility', () => {
  it('calculates the estimated birth date by adding 280 days', () => {
    const lmpDate = '2026-04-01'
    // 2026-04-01 + 280 days is January 6, 2027
    const birthDate = calculateArrivalDate(lmpDate)
    expect(birthDate.toISOString().slice(0, 10)).toBe('2027-01-06')
  })

  it('calculates the correct current week on the first day of pregnancy (LMP = today)', () => {
    const today = new Date('2026-06-06')
    const lmp = '2026-06-06'
    expect(calculateCurrentWeek(lmp, today)).toBe(1)
  })

  it('calculates correct week number after 6 days elapsed (still Week 1)', () => {
    const today = new Date('2026-06-12')
    const lmp = '2026-06-06'
    expect(calculateCurrentWeek(lmp, today)).toBe(1)
  })

  it('calculates correct week number on day 7 (enters Week 2)', () => {
    const today = new Date('2026-06-13')
    const lmp = '2026-06-06'
    expect(calculateCurrentWeek(lmp, today)).toBe(2)
  })

  it('calculates correct week number for Week 10 (day 66 elapsed)', () => {
    const today = new Date('2026-06-11')
    const lmp = '2026-04-06' // 66 days difference
    expect(calculateCurrentWeek(lmp, today)).toBe(10)
  })

  it('clamps the maximum week number to 40 even if gestation exceeds 40 weeks', () => {
    const today = new Date('2027-02-15')
    const lmp = '2026-04-01' // way past 280 days
    expect(calculateCurrentWeek(lmp, today)).toBe(40)
  })
})
