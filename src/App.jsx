import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import WeekDetails from './pages/WeekDetails'
import { getPersistedLMP, calculateCurrentWeek, clearPersistedData } from './utils/pregnancy'

function AppContent() {
  const [currentWeek, setCurrentWeek] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  
  const pathname = location.pathname
  const isWeekPage = pathname.includes('/week/')
  const weekNum = isWeekPage ? pathname.split('/').pop() : null

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

  const handleReset = () => {
    clearPersistedData()
    setIsSettingsOpen(false)
    navigate('/')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Navigation Header */}
      <header className="w-full sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#f2edd6]/80 shadow-sm transition-all duration-300">
        <div className="navbar max-w-6xl mx-auto w-full px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-1 md:gap-2">
            <Link to="/" className="text-2xl font-display font-black tracking-tight text-primary flex items-center gap-1.5 min-h-[48px] px-2 rounded-xl hover:bg-[#faf7f2]/50 transition-colors shrink-0">
              👶 Bump Buddy
            </Link>
            
            <div className="text-sm breadcrumbs font-bold text-neutral">
              <ul>
                <li>
                  {isWeekPage ? (
                    <Link to="/" className="text-neutral/50 hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  ) : (
                    <span className="text-neutral/50">Dashboard</span>
                  )}
                </li>
                {isWeekPage && (
                  <li>
                    <span className="text-primary font-black">
                      Week {weekNum} Journal
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="flex-none flex items-center gap-3">
            {/* Settings Gear Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="btn btn-ghost btn-circle text-neutral/70 hover:text-primary transition-colors min-h-[40px] w-10 h-10 flex items-center justify-center rounded-full"
              title="Open Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
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

      {/* settings modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-[#f2edd6] shadow-2xl w-full max-w-md p-6 relative flex flex-col gap-4">
            {/* Close Button */}
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-neutral/50 hover:text-neutral transition-colors w-8 h-8 flex items-center justify-center bg-[#faf7f2] rounded-full font-bold"
              title="Close Settings"
            >
              ✕
            </button>
            
            <div>
              <h3 className="text-xl font-display font-black text-primary">Settings</h3>
              <p className="text-xs text-neutral/50 mt-1 font-semibold">Manage your pregnancy tracker data.</p>
            </div>

            <div className="border-t border-[#f2edd6] pt-4 flex flex-col gap-4">
              <div className="bg-[#faf7f2] rounded-2xl p-4 border border-[#f2edd6]/60">
                <h4 className="text-xs font-bold text-neutral">🔒 100% Private</h4>
                <p className="text-xs text-neutral/70 mt-1 leading-relaxed font-semibold">
                  All of your pregnancy dates, calculations, and checklist progress are stored locally on your device. No registration is required, and no data is ever uploaded.
                </p>
              </div>

              <div className="bg-red-50/40 rounded-2xl p-4 border border-red-100/60 flex flex-col gap-2.5 mt-2">
                <h4 className="text-xs font-bold text-error">⚠️ Reset Tracker</h4>
                <p className="text-xs text-neutral/70 leading-relaxed font-semibold">
                  Clearing the tracker data will permanently delete your Last Menstrual Period date and reset all weekly checklists.
                </p>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your pregnancy tracker and checklists? This will start the app over and delete all progress.")) {
                      handleReset()
                    }
                  }}
                  className="btn btn-error btn-sm w-full text-white font-bold h-10 rounded-xl mt-1 shadow-sm"
                >
                  Reset Tracker & Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  )
}
