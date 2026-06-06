import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OnboardingWizard from '../components/OnboardingWizard'
import { getPersistedLMP, setPersistedLMP, clearPersistedData, calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
import weeksData from '../data/weeks.json'

export default function Home() {
  const [lmp, setLmp] = useState('')
  const [activeWeekData, setActiveWeekData] = useState(null)

  useEffect(() => {
    const savedLmp = getPersistedLMP()
    if (savedLmp) {
      setLmp(savedLmp)
      const weekNum = calculateCurrentWeek(savedLmp)
      const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
      setActiveWeekData(matchedWeek || null)
    } else {
      setLmp('')
      setActiveWeekData(null)
    }
  }, [])

  const handleOnboardingComplete = (selectedLmp) => {
    setPersistedLMP(selectedLmp)
    setLmp(selectedLmp)
    const weekNum = calculateCurrentWeek(selectedLmp)
    const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
    setActiveWeekData(matchedWeek || null)
    // Custom storage event to let App.jsx header sync its week badge immediately
    window.dispatchEvent(new Event('storage'))
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your pregnancy tracker and checklists? This will start the app over and delete all progress.")) {
      clearPersistedData()
      setLmp('')
      setActiveWeekData(null)
      window.dispatchEvent(new Event('storage'))
    }
  }

  const formattedBirthDate = () => {
    if (!lmp) return ''
    const date = calculateArrivalDate(lmp)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const currentWeekNum = () => {
    if (!lmp) return 1
    return calculateCurrentWeek(lmp)
  }

  // New User Mode: Render onboarding wizard
  if (!lmp) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="text-center max-w-md mb-8 mt-4">
          <h1 className="text-4xl font-extrabold text-primary mb-2">👶 Bump Buddy</h1>
          <p className="text-neutral text-sm leading-relaxed">
            Your simple, private, loginless pregnancy guide.
          </p>
        </div>
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // Returning User Mode: Render dashboard
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-6 px-4">
      {/* Welcome Back Card */}
      <div className="card w-full bg-white shadow-lg border border-gray-100 p-6 flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold text-primary">Welcome Back! ✨</h2>
        <p className="text-sm text-neutral">Here is your current pregnancy summary:</p>

        {/* Active Week Summary Card */}
        {activeWeekData && (
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-primary">Week {activeWeekData.weekNumber}</span>
              <span className="badge badge-secondary font-bold text-xs py-2 px-3">
                🍓 {activeWeekData.sizeComparison}
              </span>
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold text-neutral/70 tracking-wider">Baby's Current Size</h3>
              <p className="text-sm text-neutral mt-0.5">
                Your baby is currently about the size of a <b>{activeWeekData.sizeComparison}</b>.
              </p>
            </div>
            <div className="border-t border-dashed border-primary/20 pt-3">
              <h3 className="text-xs uppercase font-bold text-neutral/70 tracking-wider">Week Highlight</h3>
              <p className="text-sm text-neutral mt-0.5 leading-relaxed">
                {activeWeekData.highlights[0] || 'Baby is continuing to develop rapidly.'}
              </p>
            </div>
          </div>
        )}

        {/* Arrival Date Display */}
        <div className="bg-base-100 rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-neutral font-semibold">
            Estimated due date: <span className="font-bold text-primary">{formattedBirthDate()}</span>
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-3 mt-4">
          <Link 
            to={`/week/${currentWeekNum()}`}
            className="btn btn-primary w-full h-12 min-h-[48px] text-white font-bold"
          >
            See details & checklist for this week ➔
          </Link>

          <button 
            onClick={handleReset}
            className="btn btn-outline btn-ghost w-full h-12 min-h-[48px] text-xs font-semibold text-gray-500 hover:text-error hover:bg-error/10 hover:border-error"
          >
            Reset Tracker / Clear Memory 🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
