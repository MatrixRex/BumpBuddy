import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import WeekDetails from './pages/WeekDetails'
import { getPersistedLMP, calculateCurrentWeek } from './utils/pregnancy'

export default function App() {
  const [currentWeek, setCurrentWeek] = useState(null)

  const syncPregnancyState = () => {
    const savedLmp = getPersistedLMP()
    if (savedLmp) {
      setCurrentWeek(calculateCurrentWeek(savedLmp))
    } else {
      setCurrentWeek(null)
    }
  }

  useEffect(() => {
    syncPregnancyState()
    // Event listener for immediate state sync across onboarding/reset events
    window.addEventListener('storage', syncPregnancyState)
    return () => {
      window.removeEventListener('storage', syncPregnancyState)
    }
  }, [])

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex flex-col min-h-screen bg-base-100">
        {/* Navigation Header */}
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="navbar max-w-6xl mx-auto w-full px-4 md:px-6 py-2">
            <div className="flex-1">
              <Link to="/" className="text-xl font-black text-primary tracking-tight flex items-center gap-1 min-h-[48px] px-2 rounded-lg hover:bg-base-100">
                👶 Bump Buddy
              </Link>
            </div>
            {currentWeek !== null && (
              <div className="flex-none gap-2">
                <Link 
                  to={`/week/${currentWeek}`} 
                  className="badge badge-primary font-bold text-xs p-3 hover:bg-primary/95 transition-colors cursor-pointer min-h-[30px]"
                >
                  Week {currentWeek}
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 pb-10 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week/:weekNumber" element={<WeekDetails />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-white border-t border-gray-100">
          <div className="footer footer-center p-4 text-neutral-content max-w-6xl mx-auto w-full">
            <div>
              <p className="text-xs text-neutral font-semibold">
                © 2026 Bump Buddy • Made with care for expecting parents
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}
