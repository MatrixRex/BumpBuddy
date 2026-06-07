import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OnboardingWizard from '../components/OnboardingWizard'
import { getPersistedLMP, setPersistedLMP, calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
import weeksData from '../data/weeks.json'
import cozyBabyGrowth from '../assets/cozy_baby_growth.png'

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

  // Sync state if storage changes (e.g. from reset settings modal)
  useEffect(() => {
    const handleSync = () => {
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
    }
    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [])

  const handleOnboardingComplete = (selectedLmp) => {
    setPersistedLMP(selectedLmp)
    setLmp(selectedLmp)
    const weekNum = calculateCurrentWeek(selectedLmp)
    const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
    setActiveWeekData(matchedWeek || null)
    window.dispatchEvent(new Event('storage'))
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

  // Onboarding view for new users
  if (!lmp) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="text-center max-w-md mb-8 mt-4">
          <h1 className="text-4xl font-display font-black text-primary mb-2">👶 Bump Buddy</h1>
          <p className="text-neutral/70 text-sm leading-relaxed font-bold">
            Your cozy, private pregnancy journal companion.
          </p>
        </div>
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  const trimesters = [
    { name: "Trimester 1", description: "W 1 - 13", weeks: Array.from({ length: 13 }, (_, i) => i + 1) },
    { name: "Trimester 2", description: "W 14 - 27", weeks: Array.from({ length: 14 }, (_, i) => i + 14) },
    { name: "Trimester 3", description: "W 28 - 40", weeks: Array.from({ length: 13 }, (_, i) => i + 28) }
  ]

  return (
    <div className="w-full py-2 relative z-10 flex flex-col gap-6">
      
      {/* Combined Dashboard Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Timeline Summary & Week Navigator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Due Date & Pregnancy Timeline Card */}
          <div className="notebook-card p-6 flex flex-col justify-center text-center bg-white border border-[#f2edd6]/85">
            <h3 className="text-[10px] uppercase font-extrabold text-neutral/50 tracking-wider">Pregnancy Timeline</h3>
            <div className="mt-1.5">
              <p className="text-xs text-neutral/60 font-bold">Estimated Due Date (EDD)</p>
              <h4 className="text-2xl font-display font-black text-primary mt-0.5">{formattedBirthDate()}</h4>
            </div>
            <div className="badge bg-[#ebb0c9] text-secondary-content font-bold border-none py-2 px-4.5 mx-auto mt-2.5 text-xs shadow-sm rounded-full">
              Due in {40 - currentWeek} Weeks
            </div>
          </div>

          {/* Timeline Browser */}
          <div className="notebook-card w-full p-5 bg-white border border-[#f2edd6]/85 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#f2edd6]/60 pb-2.5">
                <h3 className="text-sm font-display font-extrabold text-primary flex items-center gap-1.5">
                  🗺️ Timeline Browser
                </h3>
              </div>
              
              <div className="flex flex-col gap-4 mt-3">
                {trimesters.map((t) => (
                  <div key={t.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-extrabold text-neutral">{t.name}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.description}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {t.weeks.map((wNum) => {
                        const isActive = wNum === currentWeek
                        const isPast = wNum < currentWeek
                        
                        let btnClass = "btn btn-xs h-7 min-h-[28px] w-full text-[10px] font-bold transition-all duration-200 p-0 rounded-full "
                        if (isActive) {
                          btnClass += "btn-primary shadow-sm pulse-active text-white border-none"
                        } else if (isPast) {
                          btnClass += "bg-primary/10 border-transparent text-primary hover:bg-primary/20"
                        } else {
                          btnClass += "bg-[#faf7f2] border border-[#f2edd6]/60 text-neutral/70 hover:bg-[#ebdccb]/30"
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
          </div>

        </div>

        {/* Right Column: Active Week Spotlight Card (Primary Focus) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {activeWeekData && (
            <div className="notebook-card p-6 md:p-8 bg-white border border-[#f2edd6]/80 flex flex-col justify-between h-full relative overflow-hidden">
              {/* Header section with week indicator */}
              <div className="flex justify-between items-center border-b border-[#f2edd6]/60 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    👶 Weekly Spotlight
                  </span>
                  <h2 className="text-3xl font-display font-black text-primary mt-3 leading-none">Week {activeWeekData.weekNumber}</h2>
                </div>
                <div className="text-right">
                  <span className="badge badge-secondary font-bold text-xs py-2.5 px-4 shadow-sm rounded-full text-secondary-content">
                    🍓 {activeWeekData.sizeComparison}
                  </span>
                </div>
              </div>

              {/* Spotlight Content split side-by-side on desktop */}
              <div className="flex flex-col md:flex-row gap-8 items-center flex-grow">
                
                {/* Large Polaroid Image Frame */}
                <div className="w-full md:w-auto flex justify-center shrink-0">
                  <div className="polaroid-frame rotate-1 w-56 md:w-64">
                    <img 
                      src={cozyBabyGrowth} 
                      alt="Baby growth illustration" 
                      className="w-full h-auto object-contain rounded-md border border-[#f2edd6]/60 bg-[#faf7f2]/20"
                    />
                    <div className="polaroid-caption mt-2 text-primary font-handwritten text-2xl">
                      {activeWeekData.sizeComparison}
                    </div>
                  </div>
                </div>

                {/* Development Details, Highlights & Progress */}
                <div className="flex-1 flex flex-col justify-between h-full w-full gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-[10px] uppercase font-extrabold text-neutral/40 tracking-wider">Size Description</h3>
                      <p className="text-sm text-neutral mt-1 leading-relaxed font-bold">
                        Your baby is about the size of a <b className="text-primary font-extrabold">{activeWeekData.sizeComparison}</b> this week.
                      </p>
                    </div>
                    
                    <div className="border-t border-[#f2edd6]/60 pt-3">
                      <h3 className="text-[10px] uppercase font-extrabold text-neutral/40 tracking-wider">Weekly Highlight</h3>
                      <p className="text-sm text-neutral mt-1 leading-relaxed font-semibold">
                        {activeWeekData.highlights[0] || 'Baby is continuing to develop rapidly.'}
                      </p>
                    </div>
                  </div>

                  {/* Checklist progress bar */}
                  <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20 flex flex-col gap-2 mt-2 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase font-extrabold text-neutral/80 tracking-wider flex items-center gap-1">
                        ✅ Checklist Progress
                      </h4>
                      <span className="text-[10px] font-bold text-neutral bg-accent/20 px-2 py-0.5 rounded-full">
                        {completedChecklistCount}/{totalChecklistCount} Tasks
                      </span>
                    </div>
                    <div className="w-full bg-gray-200/60 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-accent h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${checklistPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-neutral/60 font-bold">
                      {checklistPercentage === 100 
                        ? "🎉 All checklist tasks complete!"
                        : `${checklistPercentage}% completed`}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link 
                      to={`/week/${currentWeek}`}
                      className="custom-btn-primary w-full h-12 text-sm text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Open Week {currentWeek} Journal Guide ➔
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
