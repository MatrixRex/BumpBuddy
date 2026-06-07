import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import weeksData from '../data/weeks.json'
import { getPersistedLMP, calculateCurrentWeek } from '../utils/pregnancy'
import cozyBabyGrowth from '../assets/cozy_baby_growth.png'

export default function WeekDetails() {
  const { weekNumber } = useParams()
  const currentWeekIdx = parseInt(weekNumber, 10)
  
  // Find relevant week data from weeks.json
  const weekData = weeksData.find((w) => w.weekNumber === currentWeekIdx)
  
  // Track user active week based on saved LMP
  const [userActiveWeek, setUserActiveWeek] = useState(null)
  const [checkedTasks, setCheckedTasks] = useState([])
  
  const activeTabRef = useRef(null)
  const tabContainerRef = useRef(null)

  // Load active week and checklist checked states
  useEffect(() => {
    const savedLmp = getPersistedLMP()
    if (savedLmp) {
      setUserActiveWeek(calculateCurrentWeek(savedLmp))
    } else {
      setUserActiveWeek(null)
    }

    // Load checked items from localStorage
    const localKey = `bump_buddy_week_${currentWeekIdx}_checklist`
    const savedChecks = localStorage.getItem(localKey)
    if (savedChecks) {
      try {
        setCheckedTasks(JSON.parse(savedChecks))
      } catch (e) {
        setCheckedTasks([])
      }
    } else {
      setCheckedTasks([])
    }
  }, [currentWeekIdx])

  // Center the active week tab in the horizontal scroll bar
  useEffect(() => {
    if (activeTabRef.current && tabContainerRef.current) {
      const container = tabContainerRef.current
      const tab = activeTabRef.current
      const scrollPos = tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2)
      container.scrollTo({ left: scrollPos, behavior: 'smooth' })
    }
  }, [currentWeekIdx, userActiveWeek])

  // Toggle checklist tasks
  const handleCheckboxChange = (task) => {
    const updated = checkedTasks.includes(task)
      ? checkedTasks.filter((t) => t !== task)
      : [...checkedTasks, task]
    
    setCheckedTasks(updated)
    const localKey = `bump_buddy_week_${currentWeekIdx}_checklist`
    localStorage.setItem(localKey, JSON.stringify(updated))
  }

  if (!weekData) {
    return (
      <div className="text-center py-12 px-4 relative z-10">
        <h2 className="text-3xl font-display font-bold text-error">Week not found</h2>
        <p className="text-sm text-neutral/70 mt-2 font-semibold">Bump Buddy guides go from Week 1 to Week 40.</p>
        <Link to="/" className="custom-btn-primary btn-sm mt-6 px-6 py-2">Go Home</Link>
      </div>
    )
  }

  // Create week index array (1 to 40)
  const allWeeks = Array.from({ length: 40 }, (_, i) => i + 1)

  return (
    <div className="w-full py-2 relative z-10 flex flex-col gap-6">
      
      {/* 📅 Horizontal Binder-Style Week Navigator index strip */}
      <div className="notebook-card bg-white border border-[#f2edd6]/80 p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center px-1 border-b border-[#f2edd6]/60 pb-1.5">
          <span className="text-[10px] uppercase font-extrabold text-neutral/50 tracking-wider">Scrapbook Week Index</span>
          {userActiveWeek && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Your Current State: Week {userActiveWeek}
            </span>
          )}
        </div>
        
        {/* Horizontal scrollable row of tabs */}
        <div 
          ref={tabContainerRef}
          className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent select-none"
        >
          {allWeeks.map((wNum) => {
            const isViewingWeek = wNum === currentWeekIdx
            const isActualWeek = wNum === userActiveWeek
            
            let tabClass = "px-3.5 py-1.5 text-xs font-bold transition-all duration-150 rounded-full shrink-0 flex items-center justify-center gap-1 cursor-pointer "
            if (isViewingWeek) {
              tabClass += "bg-primary text-white shadow-sm"
            } else if (isActualWeek) {
              tabClass += "bg-[#ebb0c9] text-secondary-content border border-[#ebb0c9]/50 shadow-inner pulse-active"
            } else {
              tabClass += "bg-[#faf7f2] border border-[#f2edd6]/80 text-neutral/70 hover:bg-[#ebdccb]/30"
            }

            return (
              <Link 
                key={wNum} 
                to={`/week/${wNum}`}
                ref={isViewingWeek ? activeTabRef : null}
                className={tabClass}
                title={`Go to Week ${wNum} journal page`}
              >
                Wk {wNum}
                {isActualWeek && !isViewingWeek && (
                  <span className="w-1.5 h-1.5 bg-primary rounded-full border border-white"></span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Week Traversal Header on mobile */}
      <div className="flex justify-between items-center notebook-card p-3 bg-white border border-[#f2edd6]/80 lg:hidden">
        {currentWeekIdx > 1 ? (
          <Link to={`/week/${currentWeekIdx - 1}`} className="btn btn-sm btn-ghost h-10 min-h-[40px] text-primary font-bold">
            ◀ Wk {currentWeekIdx - 1}
          </Link>
        ) : (
          <button className="btn btn-sm btn-ghost btn-disabled opacity-20 h-10 min-h-[40px] font-bold">◀ Wk 1</button>
        )}
        <span className="font-display font-extrabold text-sm text-primary">Week {weekData.weekNumber} Page</span>
        {currentWeekIdx < 40 ? (
          <Link to={`/week/${currentWeekIdx + 1}`} className="btn btn-sm btn-ghost h-10 min-h-[40px] text-primary font-bold">
            Wk {currentWeekIdx + 1} ▶
          </Link>
        ) : (
          <button className="btn btn-sm btn-ghost btn-disabled opacity-20 h-10 min-h-[40px] font-bold">Wk 40 ▶</button>
        )}
      </div>

      {/* Contextual Active Week Alert on mobile */}
      {userActiveWeek !== null && userActiveWeek !== currentWeekIdx && (
        <div className="alert text-xs leading-relaxed py-2.5 px-3.5 rounded-xl border bg-primary/5 border-primary/10 text-neutral lg:hidden">
          <span>ℹ️</span>
          <div className="font-semibold">
            Currently in Week {userActiveWeek}. 
            <Link to={`/week/${userActiveWeek}`} className="underline font-extrabold text-primary ml-1">Go ➔</Link>
          </div>
        </div>
      )}

      {/* Main Open Diary Journal Spread Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Page Spread: size Polaroid & Highlights side-by-side */}
        <div className="lg:col-span-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* Polaroid Baby Size Box */}
          <div className="md:col-span-6 notebook-card p-5 bg-white border border-[#f2edd6]/80 flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center border-b border-[#f2edd6]/60 pb-3 mb-4">
              <div className="text-left">
                <span className="text-[9px] uppercase font-extrabold text-primary/80">Baby Growth Comparison</span>
                <h4 className="text-lg font-display font-extrabold text-primary leading-none mt-0.5">Week {weekData.weekNumber}</h4>
              </div>
              <span className="badge bg-[#ebb0c9] text-secondary-content font-bold border-none py-1.5 px-3 text-xs shadow-sm rounded-full">
                {weekData.sizeComparison}
              </span>
            </div>

            {/* Large Polaroid Picture Mockup */}
            <div className="polaroid-frame rotate-1 w-52 md:w-56 my-2">
              <img 
                src={cozyBabyGrowth} 
                alt="Baby growth comparison" 
                className="w-full h-auto object-contain rounded-md border border-[#f2edd6]/85 bg-[#faf7f2]/20"
              />
              <div className="polaroid-caption mt-1.5 text-primary font-handwritten text-xl">
                {weekData.sizeComparison}
              </div>
            </div>

            <div className="w-full border-t border-[#f2edd6]/60 pt-3 mt-4 text-left">
              <p className="text-xs text-neutral/70 italic font-bold">
                Your baby is growing fast. Keep tracking to see details.
              </p>
            </div>
          </div>

          {/* Highlights & Healthy Tip */}
          <div className="md:col-span-6 flex flex-col gap-6 justify-between items-stretch">
            
            {/* Development Highlights (Notebook ruled page) */}
            <div className="notebook-card p-5 bg-white border border-[#f2edd6]/80 flex-grow relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-red-200/40"></div>
              <div className="pl-4">
                <h3 className="text-sm font-display font-extrabold text-primary border-b border-[#f2edd6]/60 pb-2.5 mb-3">
                  ✨ Journal Highlights
                </h3>
                <ul className="list-disc list-inside text-xs text-neutral/85 flex flex-col gap-3 leading-relaxed font-semibold">
                  {weekData.highlights.map((highlight, idx) => (
                    <li key={idx} className="pl-1 pr-1">{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky Note Healthy Tip */}
            <div className="bg-[#ebb0c9]/10 border-l-4 border-[#ebb0c9] p-4.5 rounded-r-2xl rounded-l-none shadow-sm flex flex-col gap-1 border-y border-r border-[#ebb0c9]/25">
              <h4 className="text-[10px] uppercase font-extrabold text-secondary tracking-widest">💡 Healthy Tip</h4>
              <p className="text-xs text-neutral/85 leading-relaxed font-bold">
                {weekData.healthTip}
              </p>
            </div>

          </div>

        </div>

        {/* Right Page Spread: Checklist & Action button */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Checklist */}
          <div className="notebook-card p-5 bg-white border border-[#f2edd6]/80 flex flex-col justify-between h-full">
            <div>
              <div className="border-b border-[#f2edd6]/60 pb-2.5 mb-4 flex items-center justify-between">
                <h3 className="text-base font-display font-extrabold text-primary">
                  ✅ Weekly Checklist
                </h3>
                <span className="badge badge-accent font-bold text-xs py-1 px-2.5 rounded-full text-white">
                  {checkedTasks.length}/{weekData.checklist.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {weekData.checklist.map((task, idx) => {
                  const isChecked = checkedTasks.includes(task)
                  return (
                    <label 
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 cursor-pointer custom-checklist-item min-h-[44px] ${
                        isChecked ? 'checked' : ''
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(task)}
                        className="checkbox checkbox-primary checkbox-xs mt-0.5 accent-primary"
                      />
                      <span className={`text-xs leading-relaxed font-semibold transition-all duration-200 ${
                        isChecked ? 'line-through text-neutral/40' : 'text-neutral'
                      }`}>
                        {task}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Dashboard Action Return */}
            <div className="border-t border-[#f2edd6]/60 pt-3 mt-4">
              <Link 
                to="/" 
                className="btn btn-outline btn-ghost w-full h-11 text-xs font-bold rounded-xl transition-all duration-200 border-[#f2edd6]/80 hover:bg-neutral/5"
              >
                ◀ Return to Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
