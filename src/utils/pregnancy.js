export function calculateArrivalDate(lmpString) {
  if (!lmpString) return new Date()
  const lmpDate = new Date(lmpString)
  // Add 280 days (40 weeks) in milliseconds
  const arrivalDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
  return arrivalDate
}

export function calculateCurrentWeek(lmpString, currentDate = new Date()) {
  if (!lmpString) return 1
  const lmpDate = new Date(lmpString)
  
  // Strip out time of day to ensure consistent date arithmetic
  const lmpMidnight = new Date(lmpDate.getFullYear(), lmpDate.getMonth(), lmpDate.getDate())
  const curMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  const diffTime = curMidnight.getTime() - lmpMidnight.getTime()
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000))

  if (diffDays < 0) return 1 // Safety clamp for future dates/early values
  
  const week = Math.floor(diffDays / 7) + 1
  // Clamp maximum week number to 40 per instructions
  return Math.min(40, week)
}

export function getPersistedLMP() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('bump_buddy_lmp') || ''
  }
  return ''
}

export function setPersistedLMP(lmpString) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('bump_buddy_lmp', lmpString)
  }
}

export function clearPersistedData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('bump_buddy_lmp')
    // Clear all weekly checklists
    for (let i = 1; i <= 40; i++) {
      localStorage.removeItem(`bump_buddy_week_${i}_checklist`)
    }
  }
}
