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
    window.addEventListener('storage', syncPregnancyState)
    return () => {
      window.removeEventListener('storage', syncPregnancyState)
    }
  }, [])

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex flex-col min-h-screen bg-[#faf7f2] relative overflow-x-hidden">
        {/* Navigation Header */}
        <header className="w-full sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#f2edd6]/80 shadow-sm transition-all duration-300">
          <div className="navbar max-w-6xl mx-auto w-full px-4 md:px-6 py-2">
            <div className="flex-1">
              <Link to="/" className="text-2xl font-display font-black tracking-tight text-primary flex items-center gap-1.5 min-h-[48px] px-2 rounded-xl hover:bg-[#faf7f2]/50 transition-colors">
                👶 Bump Buddy
              </Link>
            </div>
            
            <div className="flex-none flex items-center gap-3 md:gap-4">
              {currentWeek !== null && (
                <Link 
                  to={`/week/${currentWeek}`} 
                  className="badge badge-primary font-bold text-xs p-3.5 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-h-[30px] shadow-sm rounded-full text-white"
                >
                  Week {currentWeek} Guide
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 pb-12 pt-6 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week/:weekNumber" element={<WeekDetails />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-[#ffffff] border-t border-[#f2edd6]/60 relative z-10">
          <div className="footer footer-center p-6 text-neutral-content max-w-6xl mx-auto w-full">
            <div>
              <p className="text-xs text-neutral font-semibold opacity-70">
                © 2026 Bump Buddy • Made with care for expecting parents
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}
