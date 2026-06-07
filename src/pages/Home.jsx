import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OnboardingWizard from '../components/OnboardingWizard'
import { getPersistedLMP, setPersistedLMP, calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
import weeksData from '../data/weeks.json'
import cozyBabyGrowth from '../assets/cozy_baby_growth.png'
import Icon from '../components/Icon'


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

  const displayedWeeks = (() => {
    const startWeek = Math.max(1, Math.min(36, currentWeek - 2))
    const endWeek = Math.min(40, startWeek + 4)
    const weeks = []
    for (let w = startWeek; w <= endWeek; w++) {
      weeks.push(w)
    }
    return weeks
  })()

  // Onboarding view for new users
  if (!lmp) {
    return (
      <div className="flex flex-col items-center justify-center py-6 md:py-12 px-4 min-h-[75vh]">
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
        
        {/* Left Column: Active Week Spotlight Card (Primary Focus) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {activeWeekData && (
            <div className="notebook-card p-6 md:p-8 bg-white border border-[#f2edd6]/80 flex flex-col justify-between h-full relative overflow-hidden">
              {/* Header section with week indicator */}
              <div className="flex justify-between items-center border-b border-[#f2edd6]/60 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    <Icon name="baby" size={14} className="text-primary" /> Weekly Spotlight
                  </span>
                  <h2 className="text-3xl font-display font-black text-primary mt-3 leading-none">Week {activeWeekData.weekNumber}</h2>
                </div>
                <div className="text-right">
                  <span className="badge badge-secondary font-bold text-xs py-2.5 px-4 shadow-sm rounded-full text-secondary-content inline-flex items-center gap-1.5">
                    <Icon name="scale" size={14} className="text-secondary-content" /> {activeWeekData.sizeComparison}
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
                      <h4 className="text-[10px] uppercase font-extrabold text-neutral/80 tracking-wider flex items-center gap-1.5">
                        <Icon name="check" size={14} className="text-accent" /> Checklist Progress
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
                    <p className="text-[10px] text-neutral/60 font-bold flex items-center gap-1">
                      {checklistPercentage === 100 
                        ? <><Icon name="confetti" size={14} className="text-accent" /> All checklist tasks complete!</>
                        : `${checklistPercentage}% completed`}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link 
                      to={`/week/${currentWeek}`}
                      className="custom-btn-primary w-full h-12 text-sm text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Open Week {currentWeek} Guide ➔
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Timeline Summary & Week Navigator (No reset button here anymore) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Due Date & Pregnancy Timeline Card */}
          <div className="notebook-card p-6 flex flex-col justify-center text-center bg-white border border-[#f2edd6]/85">
            <h3 className="text-[10px] uppercase font-extrabold text-neutral/50 tracking-wider">Pregnancy Timeline</h3>
            <div className="mt-1.5">
              <p className="text-xs text-neutral/60 font-bold">Estimated Due Date (EDD)</p>
              <h4 className="text-2xl font-display font-black text-primary mt-0.5">{formattedBirthDate()}</h4>
            </div>
            <div className="badge bg-[#e8b7b3] text-secondary-content font-bold border-none py-2 px-4.5 mx-auto mt-2.5 text-xs shadow-sm rounded-full">
              Due in {40 - currentWeek} Weeks
            </div>
          </div>

          {/* Timeline Browser Card */}
          <div className="notebook-card w-full p-6 bg-white border border-[#f2edd6]/85 flex flex-col justify-between h-full">
            <div>
              <div className="border-b border-[#f2edd6]/60 pb-3 mb-4 flex justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-primary flex items-center gap-1.5">
                    <Icon name="calendar" size={16} className="text-primary" /> Journey Timeline
                  </h3>
                  <p className="text-[10px] text-neutral/50 mt-0.5 font-bold">Your active weeks path (centered around Week {currentWeek})</p>
                </div>
                <Link 
                  to="/timeline" 
                  className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10 rounded-lg flex items-center gap-1 shrink-0"
                  title="View Full Journey Timeline"
                >
                  Expand ↗
                </Link>
              </div>
              
              {/* Vertical Timeline Container */}
              <ul className="timeline timeline-vertical timeline-compact w-full mt-2">
                {displayedWeeks.map((wNum, index) => {
                  const isCurrent = wNum === currentWeek
                  const isPast = wNum < currentWeek
                  const weekData = weeksData.find(w => w.weekNumber === wNum)
                  
                  // Get trimester details for color coding
                  let activeLineColor = "bg-primary"
                  let activeTextColor = "text-primary"
                  let badgeColor = "bg-primary/10 text-primary"
                  
                  if (wNum >= 14 && wNum <= 27) {
                    activeLineColor = "bg-[#e8b7b3]"
                    activeTextColor = "text-[#96473f]"
                    badgeColor = "bg-[#e8b7b3]/15 text-[#96473f]"
                  } else if (wNum >= 28) {
                    activeLineColor = "bg-[#9ebfa6]"
                    activeTextColor = "text-[#2e5738]"
                    badgeColor = "bg-[#9ebfa6]/15 text-[#2e5738]"
                  }

                  // Determine line connection states
                  const showIncoming = index > 0
                  const showOutgoing = index < displayedWeeks.length - 1
                  
                  const incomingLineColor = showIncoming
                    ? (wNum <= currentWeek ? activeLineColor : "bg-[#f2edd6]/80")
                    : ""
                  const outgoingLineColor = showOutgoing
                    ? (wNum < currentWeek ? activeLineColor : "bg-[#f2edd6]/80")
                    : ""

                  // Timeline middle dot/icon
                  let middleElement = null
                  if (isPast) {
                    middleElement = (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={`w-5 h-5 ${activeTextColor}`} fill="currentColor">
                        <rect width="256" height="256" fill="none"/>
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm49.51,85.51-56,56a8,8,0,0,1-11.31,0l-28-28a8,8,0,1,1,11.32-11.32L116,148.69l50.34-50.34a8,8,0,0,1,11.31,11.31Z"/>
                      </svg>
                    )
                  } else if (isCurrent) {
                    middleElement = (
                      <div className="relative flex items-center justify-center">
                        <span className={`absolute inline-flex h-5 w-5 rounded-full opacity-35 animate-ping ${activeLineColor}`}></span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={`w-5 h-5 relative z-10 ${activeTextColor}`} fill="currentColor">
                          <rect width="256" height="256" fill="none"/>
                          <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/>
                          <circle cx="128" cy="128" r="48" fill="currentColor"/>
                        </svg>
                      </div>
                    )
                  } else {
                    middleElement = (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-5 h-5 text-neutral/30">
                        <rect width="256" height="256" fill="none"/>
                        <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
                      </svg>
                    )
                  }

                  return (
                    <li key={wNum} className="w-full">
                      {showIncoming && <hr className={`${incomingLineColor}`} />}
                      
                      <div className="timeline-middle">
                        {middleElement}
                      </div>
                      
                      {/* Timeline content on the right */}
                      <div className="timeline-end w-full pl-2">
                        <Link 
                          to={`/week/${wNum}`}
                          className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-200 text-left w-full hover:scale-[1.01] ${
                            isCurrent 
                              ? 'bg-primary/5 border-primary/20 shadow-sm' 
                              : 'bg-[#faf7f2]/50 border-transparent hover:border-[#f2edd6]'
                          }`}
                        >
                          <span className={`text-xs font-bold font-display ${isCurrent ? 'text-primary text-sm' : 'text-neutral/80'}`}>
                            Week {wNum} {isCurrent && '• Today'}
                          </span>
                          {weekData && (
                            <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full ${badgeColor}`}>
                              {weekData.sizeComparison}
                            </span>
                          )}
                        </Link>
                      </div>
                      
                      {showOutgoing && <hr className={`${outgoingLineColor}`} />}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
