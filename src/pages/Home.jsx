import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OnboardingWizard from '../components/OnboardingWizard'
import { getPersistedLMP, setPersistedLMP, clearPersistedData, calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
import weeksData from '../data/weeks.json'
import cozyDashboardBanner from '../assets/cozy_dashboard_banner.png'
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

  const handleOnboardingComplete = (selectedLmp) => {
    setPersistedLMP(selectedLmp)
    setLmp(selectedLmp)
    const weekNum = calculateCurrentWeek(selectedLmp)
    const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
    setActiveWeekData(matchedWeek || null)
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
      
      {/* Row 1: Header Welcome Banner & Due Date side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Slim Welcome Banner */}
        <div className="lg:col-span-8 notebook-card overflow-hidden bg-white border border-[#f2edd6]/80 flex flex-col justify-between md:flex-row items-center">
          {/* Left: Banner text */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
              🌸 Scrapbook Companion
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary mt-3 leading-tight">Welcome, diary companion</h2>
            <p className="text-sm text-neutral/75 mt-1 leading-relaxed font-semibold">
              Here is your pregnancy summary and progress for today:
            </p>
          </div>
          {/* Right: Slim landscape cover image */}
          <div className="w-full md:w-1/3 h-32 md:h-full overflow-hidden relative border-t md:border-t-0 md:border-l border-[#f2edd6]/60 shrink-0">
            <img 
              src={cozyDashboardBanner} 
              alt="Cozy diary banner" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Due Date Card (Fills horizontal space next to header) */}
        <div className="lg:col-span-4 notebook-card p-6 flex flex-col justify-center text-center bg-white border border-[#f2edd6]/85">
          <h3 className="text-[10px] uppercase font-extrabold text-neutral/50 tracking-wider">Pregnancy Timeline</h3>
          <div className="mt-1">
            <p className="text-xs text-neutral/60 font-bold">Estimated Due Date (EDD)</p>
            <h4 className="text-2xl font-display font-black text-primary mt-0.5">{formattedBirthDate()}</h4>
          </div>
          <div className="badge bg-[#ebb0c9] text-secondary-content font-bold border-none py-2 px-4 mx-auto mt-2 text-xs shadow-sm rounded-full">
            Due in {40 - currentWeek} Weeks
          </div>
        </div>
      </div>

      {/* Row 2: Dashboard main details (Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Active Week Card & Highlights side-by-side */}
        <div className="lg:col-span-8 flex flex-col md:grid md:grid-cols-12 gap-6">
          
          {/* Active Week Size & Polaroid */}
          {activeWeekData && (
            <div className="md:col-span-6 notebook-card p-5 bg-white border border-[#f2edd6]/80 flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-between items-center border-b border-[#f2edd6]/60 pb-3 mb-4">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-extrabold text-primary tracking-wider">Active Week</span>
                  <h4 className="text-xl font-display font-black text-primary leading-none mt-0.5">Week {activeWeekData.weekNumber}</h4>
                </div>
                <span className="badge badge-secondary font-bold text-xs py-2.5 px-3 shadow-sm rounded-full text-secondary-content">
                  🍓 {activeWeekData.sizeComparison}
                </span>
              </div>

              {/* Polaroid Photo Frame (Compact for grid fit) */}
              <div className="polaroid-frame rotate-1 w-44 md:w-48 my-2">
                <img 
                  src={cozyBabyGrowth} 
                  alt="Baby size comparison" 
                  className="w-full h-auto object-contain rounded-md border border-[#f2edd6]/60 bg-[#faf7f2]/20"
                />
                <div className="polaroid-caption mt-1.5 text-primary font-handwritten text-xl">
                  {activeWeekData.sizeComparison}
                </div>
              </div>

              <div className="w-full border-t border-[#f2edd6]/60 pt-3 mt-4 text-left">
                <p className="text-xs text-neutral/70 leading-relaxed font-semibold">
                  Your baby is about the size of a <b className="text-primary font-bold">{activeWeekData.sizeComparison}</b> this week.
                </p>
              </div>
            </div>
          )}

          {/* Development Highlights & Checklist Progress */}
          {activeWeekData && (
            <div className="md:col-span-6 notebook-card p-5 bg-white border border-[#f2edd6]/80 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-extrabold text-primary border-b border-[#f2edd6]/60 pb-3 mb-3">
                  ✨ Development Highlight
                </h3>
                <p className="text-sm text-neutral/85 leading-relaxed font-semibold">
                  {activeWeekData.highlights[0] || 'Baby is continuing to develop rapidly.'}
                </p>
                <p className="text-xs text-neutral/60 mt-3 leading-relaxed font-semibold">
                  {activeWeekData.highlights[1] || 'Your body is adjusting to this wonderful journey.'}
                </p>
              </div>

              {/* Checklist Progress teaser */}
              <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20 flex flex-col gap-2.5 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] uppercase font-extrabold text-neutral/80 tracking-wider flex items-center gap-1">
                    ✅ Week {activeWeekData.weekNumber} Checklist
                  </h3>
                  <span className="text-[10px] font-bold text-neutral bg-accent/20 px-2 py-0.5 rounded-full">
                    {completedChecklistCount}/{totalChecklistCount} Tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${checklistPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-neutral/60 font-bold">
                  {checklistPercentage === 100 
                    ? "🎉 All tasks complete!"
                    : `${checklistPercentage}% completed`}
                </p>
              </div>

              <div className="mt-4">
                <Link 
                  to={`/week/${currentWeek}`}
                  className="custom-btn-primary w-full h-11 text-xs text-white font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  Open Diary Guide ➔
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Week Navigator & Reset Button */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Timeline Browser */}
          <div className="notebook-card w-full p-5 bg-white border border-[#f2edd6]/85 flex flex-col justify-between h-full">
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

            {/* Reset Tracker & Clear Data (Integrated inside sidebar) */}
            <div className="border-t border-[#f2edd6]/60 pt-3 mt-4">
              <button 
                onClick={handleReset}
                className="btn btn-ghost btn-xs w-full h-8 text-[10px] font-semibold text-gray-400 hover:text-error hover:bg-error/5 border border-transparent hover:border-error/20 transition-all rounded-lg"
              >
                Reset Tracker & Clear Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
