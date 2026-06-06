import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import weeksData from '../data/weeks.json'
import { getPersistedLMP, calculateCurrentWeek } from '../utils/pregnancy'

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
      setCheckedTasks(JSON.parse(savedChecks))
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
      <div className="text-center py-10 px-4">
        <h2 className="text-2xl font-bold text-error">Week not found</h2>
        <p className="text-sm text-neutral mt-2">Bump Buddy guides go from Week 1 to Week 40.</p>
        <Link to="/" className="btn btn-primary btn-sm mt-4">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-6 px-4">
      {/* Week Traversal Header */}
      <div className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
        {currentWeekIdx > 1 ? (
          <Link 
            to={`/week/${currentWeekIdx - 1}`}
            className="btn btn-sm btn-ghost h-10 min-h-[40px] text-primary"
          >
            ◀ Week {currentWeekIdx - 1}
          </Link>
        ) : (
          <button className="btn btn-sm btn-ghost btn-disabled opacity-20 h-10 min-h-[40px]">
            ◀ Week 1
          </button>
        )}
        <span className="font-extrabold text-sm text-primary">Week {weekData.weekNumber} Guide</span>
        {currentWeekIdx < 40 ? (
          <Link 
            to={`/week/${currentWeekIdx + 1}`}
            className="btn btn-sm btn-ghost h-10 min-h-[40px] text-primary"
          >
            Week {currentWeekIdx + 1} ▶
          </Link>
        ) : (
          <button className="btn btn-sm btn-ghost btn-disabled opacity-20 h-10 min-h-[40px]">
            Week 40 ▶
          </button>
        )}
      </div>

      {/* Contextual Active Week Alert */}
      {userActiveWeek !== null && userActiveWeek !== currentWeekIdx && (
        <div className="alert alert-info bg-primary/10 border-primary/20 text-neutral text-xs leading-relaxed py-3 px-4 rounded-xl flex gap-2">
          <span>ℹ️</span>
          <div>
            You are currently in <b>Week {userActiveWeek}</b>. 
            <Link to={`/week/${userActiveWeek}`} className="underline font-bold text-primary ml-1">
              Go to your current week ➔
            </Link>
          </div>
        </div>
      )}

      {/* Size Card Display */}
      <div className="card bg-gradient-to-br from-primary to-primary/80 text-white p-6 shadow-md rounded-2xl relative overflow-hidden">
        <div className="absolute right-4 bottom-4 text-5xl opacity-20">🤰</div>
        <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Baby's growth guide</span>
        <h2 className="text-2xl font-black mt-1">Size of a {weekData.sizeComparison}</h2>
        <p className="text-xs mt-2 opacity-80 italic">Your baby is growing fast. Here's what's happening:</p>
      </div>

      {/* Development Highlights */}
      <div className="card bg-white p-5 shadow-md border border-gray-50 rounded-2xl">
        <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
          ✨ Weekly Highlights
        </h3>
        <ul className="list-disc list-inside text-sm text-neutral mt-3 flex flex-col gap-2 leading-relaxed">
          {weekData.highlights.map((highlight, idx) => (
            <li key={idx} className="pl-1 pr-1">{highlight}</li>
          ))}
        </ul>
      </div>

      {/* Health Tip Box */}
      <div className="card bg-secondary/15 border-l-4 border-secondary p-4 rounded-r-2xl rounded-l-none shadow-sm">
        <h4 className="text-xs uppercase font-extrabold text-secondary tracking-wider">💡 Healthy Tip of the Week</h4>
        <p className="text-sm text-neutral mt-1 leading-relaxed">
          {weekData.healthTip}
        </p>
      </div>

      {/* Persistent To-Do Checklist */}
      <div className="card bg-white p-5 shadow-md border border-gray-50 rounded-2xl">
        <h3 className="text-base font-extrabold text-primary mb-3">
          ✅ Your Weekly Checklist
        </h3>
        <div className="flex flex-col gap-1">
          {weekData.checklist.map((task, idx) => {
            const isChecked = checkedTasks.includes(task)
            return (
              <label 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-100 cursor-pointer transition-colors duration-150 min-h-[48px]"
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(task)}
                  className="checkbox checkbox-primary checkbox-sm mt-0.5 accent-primary"
                />
                <span className={`text-sm leading-relaxed ${isChecked ? 'line-through text-gray-400' : 'text-neutral'}`}>
                  {task}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Dashboard Return Button */}
      <Link to="/" className="btn btn-outline btn-ghost w-full h-12 min-h-[48px] mt-2">
        ◀ Return to Dashboard
      </Link>
    </div>
  )
}
