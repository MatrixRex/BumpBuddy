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

  // Calculate checklist stats for current week
  const currentWeek = currentWeekNum()
  const currentWeekData = weeksData.find((w) => w.weekNumber === currentWeek)
  const [completedChecklistCount, setCompletedChecklistCount] = useState(0)
  const totalChecklistCount = currentWeekData ? currentWeekData.checklist.length : 0

  useEffect(() => {
    if (!lmp) return
    const localKey = `bump_buddy_week_${currentWeek}_checklist`
    const savedChecks = localStorage.getItem(localKey)
    if (savedChecks) {
      try {
        const parsed = JSON.parse(savedChecks)
        setCompletedChecklistCount(parsed.length)
      } catch (e) {
        setCompletedChecklistCount(0)
      }
    } else {
      setCompletedChecklistCount(0)
    }
  }, [lmp, currentWeek])

  const checklistPercentage = totalChecklistCount 
    ? Math.round((completedChecklistCount / totalChecklistCount) * 100) 
    : 0

  // New User Mode: Render onboarding wizard
  if (!lmp) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="text-center max-w-md mb-8 mt-4">
          <h1 className="text-4xl font-extrabold text-primary mb-2">👶 Bump Buddy</h1>
          <p className="text-neutral text-sm leading-relaxed font-semibold">
            Your simple pregnancy guide.
          </p>
        </div>
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // Returning User Mode: Render responsive dashboard
  const trimesters = [
    { name: "Trimester 1", description: "Weeks 1 - 13", weeks: Array.from({ length: 13 }, (_, i) => i + 1) },
    { name: "Trimester 2", description: "Weeks 14 - 27", weeks: Array.from({ length: 14 }, (_, i) => i + 14) },
    { name: "Trimester 3", description: "Weeks 28 - 40", weeks: Array.from({ length: 13 }, (_, i) => i + 28) }
  ]

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Welcome & Weekly Status */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          
          {/* Welcome Card */}
          <div className="card w-full bg-white shadow-lg border border-gray-100 p-6 md:p-8 flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard</span>
              <h2 className="text-3xl font-black text-primary mt-1">Welcome back to Bump Buddy</h2>
              <p className="text-sm text-neutral mt-1 leading-relaxed font-medium">
                Here is your pregnancy summary and progress for today:
              </p>
            </div>

            {/* Active Week Summary Card */}
            {activeWeekData && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-extrabold text-primary tracking-wider">Active Week</span>
                    <span className="text-2xl font-black text-primary leading-tight">Week {activeWeekData.weekNumber}</span>
                  </div>
                  <span className="badge badge-secondary font-bold text-xs py-3 px-4 shadow-sm">
                    🍓 {activeWeekData.sizeComparison}
                  </span>
                </div>
                
                <div className="border-t border-dashed border-primary/20 pt-4">
                  <h3 className="text-xs uppercase font-extrabold text-neutral/70 tracking-wider">Baby's Size Comparison</h3>
                  <p className="text-sm text-neutral mt-1">
                    Your baby is about the size of a <b className="text-primary font-bold">{activeWeekData.sizeComparison}</b> this week.
                  </p>
                </div>
                
                <div className="border-t border-dashed border-primary/20 pt-4">
                  <h3 className="text-xs uppercase font-extrabold text-neutral/70 tracking-wider">Development Highlight</h3>
                  <p className="text-sm text-neutral mt-1 leading-relaxed font-medium">
                    {activeWeekData.highlights[0] || 'Baby is continuing to develop rapidly.'}
                  </p>
                </div>
              </div>
            )}

            {/* Checklist Progress teaser */}
            {activeWeekData && (
              <div className="bg-accent/5 rounded-2xl p-5 border border-accent/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold text-neutral/80 tracking-wider flex items-center gap-1.5">
                    ✅ Week {activeWeekData.weekNumber} Checklist
                  </h3>
                  <span className="text-xs font-bold text-neutral bg-accent/20 px-2.5 py-0.5 rounded-full">
                    {completedChecklistCount}/{totalChecklistCount} Tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${checklistPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral/70 font-semibold">
                  {checklistPercentage === 100 
                    ? "🎉 Incredible! You've completed all tasks for this week!"
                    : `You have completed ${checklistPercentage}% of your checklist items.`}
                </p>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link 
                to={`/week/${currentWeek}`}
                className="btn btn-primary flex-1 h-12 min-h-[48px] text-white font-bold"
              >
                View Detailed Guide ➔
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Key Stats & Timeline Navigator */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          {/* Due Date Card */}
          <div className="card w-full bg-white shadow-lg border border-gray-100 p-6 flex flex-col gap-3 text-center">
            <h3 className="text-xs uppercase font-extrabold text-neutral/60 tracking-wider">Pregnancy Timeline</h3>
            <div>
              <p className="text-xs text-neutral/70 font-medium">Estimated Due Date (EDD)</p>
              <h4 className="text-2xl font-black text-primary mt-1">{formattedBirthDate()}</h4>
            </div>
            <div className="badge bg-secondary text-secondary-content font-bold border-none py-1.5 px-3 mx-auto mt-1 text-xs">
              Due in {40 - currentWeek} Weeks
            </div>
          </div>

          {/* Week Navigator */}
          <div className="card w-full bg-white shadow-lg border border-gray-100 p-6 flex flex-col gap-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-extrabold text-primary flex items-center gap-2">
                🗺️ Timeline Browser
              </h3>
              <p className="text-xs text-neutral mt-0.5">Click any week to view its size comparison and checklist:</p>
            </div>
            
            <div className="flex flex-col gap-4 mt-1">
              {trimesters.map((t) => (
                <div key={t.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-extrabold text-neutral">{t.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{t.description}</span>
                  </div>
                  <div className="grid grid-cols-7 sm:grid-cols-7 lg:grid-cols-7 gap-1.5">
                    {t.weeks.map((wNum) => {
                      const isActive = wNum === currentWeek
                      const isPast = wNum < currentWeek
                      
                      let btnClass = "btn btn-xs h-8 min-h-[32px] w-full text-xs font-bold transition-all duration-150 p-0 "
                      if (isActive) {
                        btnClass += "btn-primary ring-2 ring-primary ring-offset-2 text-white"
                      } else if (isPast) {
                        btnClass += "bg-primary/10 border-transparent text-primary hover:bg-primary/20"
                      } else {
                        btnClass += "bg-base-100 border border-gray-200 text-neutral hover:bg-gray-200"
                      }

                      return (
                        <Link 
                          key={wNum} 
                          to={`/week/${wNum}`}
                          className={btnClass}
                          title={`Go to Week ${wNum}`}
                        >
                          {wNum}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Settings Button */}
          <button 
            onClick={handleReset}
            className="btn btn-outline btn-ghost btn-sm w-full h-11 text-xs font-semibold text-gray-400 hover:text-error hover:bg-error/10 hover:border-error border-gray-200 transition-colors"
          >
            Reset Tracker & Clear Data
          </button>
          
        </div>
      </div>
    </div>
  )
}
