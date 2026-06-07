import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import weeksData from '../data/weeks.json'
import { getPersistedLMP, calculateCurrentWeek, calculateArrivalDate } from '../utils/pregnancy'

export default function Timeline() {
  const [currentWeek, setCurrentWeek] = useState(null)
  const [lmp, setLmp] = useState('')
  const activeWeekRef = useRef(null)

  useEffect(() => {
    const savedLmp = getPersistedLMP()
    if (savedLmp) {
      setLmp(savedLmp)
      setCurrentWeek(calculateCurrentWeek(savedLmp))
    }
  }, [])

  // Auto scroll to current week on mount
  useEffect(() => {
    if (currentWeek && activeWeekRef.current) {
      const timer = setTimeout(() => {
        activeWeekRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [currentWeek])

  const scrollToCurrentWeek = () => {
    if (activeWeekRef.current) {
      activeWeekRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

  return (
    <div className="w-full py-2 relative z-10 flex flex-col gap-6">
      {/* Page Header Card */}
      <div className="notebook-card p-6 md:p-8 bg-white border border-[#f2edd6]/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            📖 Scrapbook Timeline
          </span>
          <h1 className="text-3xl font-display font-black text-primary mt-3 leading-none">Your 40-Week Journey</h1>
          <p className="text-xs text-neutral/60 mt-2 font-bold max-w-xl leading-relaxed">
            Browse through every week of your pregnancy to see developmental milestones, size comparisons, and details for each phase.
          </p>
        </div>
        
        {currentWeek && (
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[#f2edd6] pt-4 md:pt-0 md:pl-6">
            <span className="text-[10px] font-bold text-neutral/50 uppercase tracking-wider">Active Status</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-display font-extrabold text-neutral">Week {currentWeek}</span>
              <span className="badge badge-secondary text-[10px] font-bold py-1 px-2.5 rounded-full text-secondary-content">
                Trimester {currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3}
              </span>
            </div>
            {formattedBirthDate() && (
              <p className="text-[10px] text-neutral/60 font-semibold">EDD: {formattedBirthDate()}</p>
            )}
            <button 
              onClick={scrollToCurrentWeek}
              className="custom-btn-primary btn-xs mt-1 px-3 py-1 text-[10px] h-7 font-bold rounded-lg shadow-sm flex items-center gap-1"
            >
              📍 Center Active Week
            </button>
          </div>
        )}
      </div>

      {/* Timeline Layout */}
      <div className="flex flex-col items-center">
        <ul className="timeline timeline-vertical timeline-compact w-full max-w-2xl">
          {weeksData.map((wData, idx) => {
            const wNum = wData.weekNumber
            const isCurrent = wNum === currentWeek
            const isPast = currentWeek ? wNum < currentWeek : false
            
            // Get trimester colors
            let activeLineColor = "bg-primary"
            let activeTextColor = "text-primary"
            let badgeColor = "bg-primary/10 text-primary"
            let trimesterTitle = ""
            let trimesterBadgeStyle = ""

            if (wNum >= 14 && wNum <= 27) {
              activeLineColor = "bg-[#ebb0c9]"
              activeTextColor = "text-[#b26989]"
              badgeColor = "bg-[#ebb0c9]/15 text-[#b26989]"
            } else if (wNum >= 28) {
              activeLineColor = "bg-[#92c2a0]"
              activeTextColor = "text-[#5c8266]"
              badgeColor = "bg-[#92c2a0]/15 text-[#5c8266]"
            }

            // Define trimester headers to insert
            if (wNum === 1) {
              trimesterTitle = "🌸 Trimester 1: Early Beginnings (Weeks 1 - 13)"
              trimesterBadgeStyle = "bg-primary/10 border-primary/20 text-primary"
            } else if (wNum === 14) {
              trimesterTitle = "🌸 Trimester 2: The Golden Period (Weeks 14 - 27)"
              trimesterBadgeStyle = "bg-[#ebb0c9]/15 border-[#ebb0c9]/30 text-[#b26989]"
            } else if (wNum === 28) {
              trimesterTitle = "🌸 Trimester 3: The Final Stretch (Weeks 28 - 40)"
              trimesterBadgeStyle = "bg-[#92c2a0]/15 border-[#92c2a0]/30 text-[#5c8266]"
            }

            // Determine if we show connector lines
            // We break the lines between trimesters to show progression phases clearly
            const showLineBefore = wNum !== 1 && wNum !== 14 && wNum !== 28
            const showLineAfter = wNum !== 13 && wNum !== 27 && wNum !== 40

            const incomingLineColor = showLineBefore
              ? (currentWeek && wNum <= currentWeek ? activeLineColor : "bg-[#f2edd6]/80")
              : ""
            const outgoingLineColor = showLineAfter
              ? (currentWeek && wNum < currentWeek ? activeLineColor : "bg-[#f2edd6]/80")
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
              <React.Fragment key={wNum}>
                {/* Trimester section divider */}
                {trimesterTitle && (
                  <li className="my-6 flex justify-center w-full">
                    <div className={`badge border py-3.5 px-6 text-xs font-bold shadow-sm rounded-full ${trimesterBadgeStyle}`}>
                      {trimesterTitle}
                    </div>
                  </li>
                )}

                <li 
                  ref={isCurrent ? activeWeekRef : null} 
                  className="w-full"
                >
                  {showLineBefore && <hr className={`${incomingLineColor}`} />}
                  
                  {/* Timeline Node Icon/Dot */}
                  <div className="timeline-middle">
                    {middleElement}
                  </div>

                  {/* Timeline Card Content */}
                  <div className="timeline-end w-full pl-3 pb-5">
                    <Link 
                      to={`/week/${wNum}`}
                      className={`notebook-card flex flex-col p-4 border transition-all duration-200 text-left hover:scale-[1.015] hover:shadow-md ${
                        isCurrent 
                          ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/10 shadow-sm' 
                          : 'bg-white border-[#f2edd6]/80 hover:border-[#f2edd6]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`text-base font-display font-black ${isCurrent ? 'text-primary' : 'text-neutral'}`}>
                            Week {wNum} {isCurrent && <span className="text-xs font-bold text-primary ml-1.5">• Current Week</span>}
                          </h4>
                          {/* Short summary of development */}
                          <p className="text-xs text-neutral/70 mt-1.5 leading-relaxed font-semibold">
                            {wData.highlights[0] || 'Baby is growing and changing daily.'}
                          </p>
                        </div>
                        
                        <span className={`text-[10px] font-bold py-1 px-3 shrink-0 rounded-full ${badgeColor} shadow-sm`}>
                          {wData.sizeComparison}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {showLineAfter && <hr className={`${outgoingLineColor}`} />}
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
