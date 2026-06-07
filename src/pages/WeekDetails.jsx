import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import weeksData from '../data/weeks.json'
import { getPersistedLMP, calculateCurrentWeek } from '../utils/pregnancy'
import cozyBabyGrowth from '../assets/cozy_baby_growth.png'
import Icon from '../components/Icon'


export default function WeekDetails() {
  const { weekNumber } = useParams()
  const currentWeekIdx = parseInt(weekNumber, 10)
  
  // Find relevant week data from weeks.json
  const weekData = weeksData.find((w) => w.weekNumber === currentWeekIdx)
  
  // Track user active week based on saved LMP
  const [userActiveWeek, setUserActiveWeek] = useState(null)
  const [checkedTasks, setCheckedTasks] = useState([])
  
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

  return (
    <div className="w-full py-2 relative z-10 flex flex-col gap-6">
      
      {/* 📅 Elegant Header with Week Navigation */}
      <div className="notebook-card p-6 bg-white border border-[#f2edd6]/80 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Previous Week Button */}
        <div className="flex items-center w-full sm:w-auto justify-start">
          {currentWeekIdx > 1 ? (
            <Link 
              to={`/week/${currentWeekIdx - 1}`} 
              className="btn btn-outline btn-sm rounded-full border-[#f2edd6]/80 text-neutral/80 hover:bg-neutral/5 hover:text-primary transition-all flex items-center gap-1 min-h-[40px] px-4 font-bold"
              title={`Go to Week ${currentWeekIdx - 1}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>Wk {currentWeekIdx - 1}</span>
            </Link>
          ) : (
            <button 
              disabled 
              className="btn btn-sm btn-outline rounded-full border-gray-100 text-gray-300 cursor-not-allowed min-h-[40px] px-4 opacity-50 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>Wk 1</span>
            </button>
          )}
        </div>

        {/* Center Title & Trimester Info */}
        <div className="text-center flex flex-col items-center">
          <span className={`badge font-bold text-[10px] py-1 px-3 rounded-full shadow-sm mb-1 ${
            currentWeekIdx <= 13 
              ? 'bg-primary/10 text-primary' 
              : currentWeekIdx <= 27 
                ? 'bg-[#e8b7b3]/15 text-[#96473f]' 
                : 'bg-[#9ebfa6]/15 text-[#2e5738]'
          }`}>
            Trimester {currentWeekIdx <= 13 ? 1 : currentWeekIdx <= 27 ? 2 : 3}
          </span>
          <h1 className="text-2xl font-display font-black text-primary">Week {weekData.weekNumber} Guide</h1>
          <p className="text-[11px] text-neutral/50 font-semibold mt-1">Pregnancy Journey Tracker</p>
        </div>

        {/* Next Week Button */}
        <div className="flex items-center w-full sm:w-auto justify-end">
          {currentWeekIdx < 40 ? (
            <Link 
              to={`/week/${currentWeekIdx + 1}`} 
              className="btn btn-outline btn-sm rounded-full border-[#f2edd6]/80 text-neutral/80 hover:bg-neutral/5 hover:text-primary transition-all flex items-center gap-1 min-h-[40px] px-4 font-bold"
              title={`Go to Week ${currentWeekIdx + 1}`}
            >
              <span>Wk {currentWeekIdx + 1}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <button 
              disabled 
              className="btn btn-sm btn-outline rounded-full border-gray-100 text-gray-300 cursor-not-allowed min-h-[40px] px-4 opacity-50 flex items-center gap-1"
            >
              <span>Wk 40</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contextual Active Week Alert */}
      {userActiveWeek !== null && userActiveWeek !== currentWeekIdx && (
        <div className="alert text-xs py-2.5 px-4 rounded-2xl border bg-primary/5 border-primary/10 text-neutral flex items-center gap-2">
          <Icon name="info" size={16} className="text-primary shrink-0" />
          <Link 
            to={`/week/${userActiveWeek}`} 
            className="underline font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Go to your current week (Week {userActiveWeek}) ➔
          </Link>
        </div>
      )}

      {/* Main Open Scrapbook Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Page Spread: size Polaroid & Highlights side-by-side */}
        <div className="lg:col-span-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* Polaroid Baby Size Box */}
          <div className="md:col-span-6 flex flex-col justify-center items-center text-center p-2">
            {/* Large Polaroid Picture Mockup */}
            <div className="polaroid-frame rotate-1 w-52 md:w-56">
              <img 
                src={cozyBabyGrowth} 
                alt="Baby growth comparison" 
                className="w-full h-auto object-contain rounded-md border border-[#f2edd6]/85 bg-[#faf7f2]/20"
              />
              <div className="polaroid-caption mt-1.5 text-primary font-handwritten text-xl">
                {weekData.sizeComparison}
              </div>
            </div>
            <p className="text-xs text-neutral/70 mt-4 font-semibold italic">
              Your baby is now <span className="text-primary font-extrabold">{weekData.sizeComparison}</span> sized.
            </p>
          </div>

          {/* Highlights & Healthy Tip */}
          <div className="md:col-span-6 flex flex-col gap-6 justify-between items-stretch">
            
            {/* Development Highlights (Notebook ruled page) */}
            <div className="notebook-card p-5 bg-white border border-[#f2edd6]/80 flex-grow relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-red-200/40"></div>
              <div className="pl-4">
                <h3 className="text-sm font-display font-extrabold text-primary border-b border-[#f2edd6]/60 pb-2.5 mb-3 flex items-center gap-1.5">
                  <Icon name="sparkles" size={16} className="text-primary" /> Developmental Highlights
                </h3>
                <ul className="list-disc list-inside text-xs text-neutral/85 flex flex-col gap-3 leading-relaxed font-semibold">
                  {weekData.highlights.map((highlight, idx) => (
                    <li key={idx} className="pl-1 pr-1">{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Healthy Tip (Notebook Card) */}
            <div className="notebook-card p-5 bg-white border border-[#f2edd6]/80 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-[#f2edd6]/60 pb-2.5 mb-1">
                <h4 className="text-sm font-display font-extrabold text-primary flex items-center gap-1.5">
                  <Icon name="lightbulb" size={16} className="text-primary" /> Healthy Tip
                </h4>
              </div>
              <p className="text-xs text-neutral/85 leading-relaxed font-semibold">
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
                <h3 className="text-base font-display font-extrabold text-primary flex items-center gap-1.5">
                  <Icon name="check" size={18} className="text-primary" /> Weekly Checklist
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
          </div>
        </div>

      </div>
    </div>
  )
}
