import React, { useState, useEffect } from 'react'
import { calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
import cozyPregnancyHero from '../assets/cozy_pregnancy_hero.png'
import Icon from './Icon'

const LOADING_STEPS = [
  { text: "Analyzing your Last Menstrual Period...", icon: "calendar" },
  { text: "Applying Naegele's Rule for calculation...", icon: "calculator" },
  { text: "Determining Estimated Due Date (EDD)...", icon: "hourglass" },
  { text: "Tailoring weekly baby growth comparisons...", icon: "scale" },
  { text: "Configuring customized checklist templates...", icon: "clipboard" },
  { text: "Almost ready! Preparing dashboard...", icon: "sparkles" }
]


export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [periodDate, setPeriodDate] = useState('')
  const [error, setError] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleNext = () => {
    if (step === 2 && !periodDate) {
      setError('Please select a date to calculate your timeline.')
      return
    }
    setError('')
    if (step === 2) {
      setStep('loading')
    } else {
      setStep((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (step !== 'loading') return

    setCurrentStepIndex(0)
    setIsTransitioning(false)

    let index = 0
    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        index++
        if (index < LOADING_STEPS.length) {
          setCurrentStepIndex(index)
          setIsTransitioning(false)
        } else {
          clearInterval(interval)
          setStep(3)
        }
      }, 200)
    }, 800)

    return () => clearInterval(interval)
  }, [step])

  const handleBack = () => {
    setError('')
    setStep((prev) => prev - 1)
  }

  const handleFinish = () => {
    onComplete(periodDate)
  }

  const formattedBirthDate = () => {
    if (!periodDate) return ''
    const date = calculateArrivalDate(periodDate)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const estimatedWeek = () => {
    if (!periodDate) return 1
    return calculateCurrentWeek(periodDate)
  }

  return (
    <div className="w-full max-w-md lg:max-w-5xl mx-auto notebook-card overflow-hidden transition-all duration-300 relative z-10 border border-[#f2edd6]/80 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side Presentation Panel (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 flex-col justify-center items-center relative overflow-hidden border-r border-[#f2edd6]/60">
          
          {/* Big Polaroid Image Frame */}
          <div className="z-10 flex justify-center items-center w-full">
            <div className="polaroid-frame -rotate-1 w-full max-w-[340px] shadow-md">
              <img 
                src={cozyPregnancyHero} 
                alt="Cozy parenting scene" 
                className="w-full h-auto object-contain rounded-lg border border-[#f2edd6]/40 bg-[#faf7f2]/20"
              />
              <div className="polaroid-caption mt-4 font-handwritten text-3xl text-primary">Cozy nursery moments</div>
            </div>
          </div>
          
        </div>

        {/* Mobile Top Header Graphic */}
        <div className="lg:hidden w-full h-56 overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 border-b border-[#f2edd6]/60">
          <img 
            src={cozyPregnancyHero} 
            alt="Hero Banner" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Right Side / Onboarding Content */}
        <div className="col-span-1 lg:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-white/50 backdrop-blur-sm lg:bg-white transition-colors duration-300">
          {/* Progress Steps Tracker */}
          <ul className="steps steps-horizontal w-full mb-8 text-xs font-semibold steps-secondary">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Welcome</li>
            <li className={`step ${step >= 2 || step === 'loading' ? 'step-primary' : ''}`}>Your Info</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Summary</li>
          </ul>

          {/* Step 1: Welcome & Setup */}
          {step === 1 && (
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-2xl font-display font-black text-primary">Welcome to Bump Buddy!</h2>
              <p className="text-sm text-neutral/85 leading-relaxed font-semibold">
                A warm, feel-good space to look up weekly growth guides, track highlights, and manage your checklist without an account.
              </p>
              <button 
                onClick={handleNext}
                className="custom-btn-primary w-full mt-4 h-12 min-h-[48px] text-white flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01]"
              >
                Calculate My Due Date ➔
              </button>
            </div>
          )}

          {/* Step 2: Date Input */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-display font-extrabold text-primary text-center">When was the start of your last period?</h2>
              <p className="text-sm text-neutral/85 text-center leading-relaxed font-semibold">
                We'll use your Last Menstrual Period (LMP) to calculate your estimated due date and tailor your weekly guides.
              </p>
              <div className="form-control w-full mt-2">
                <label className="label font-bold text-xs uppercase tracking-wide text-neutral/50">
                  Last Menstrual Period (LMP) Start Date
                </label>
                <input 
                  type="date" 
                  value={periodDate}
                  onChange={(e) => {
                    setPeriodDate(e.target.value)
                    setError('')
                  }}
                  max={new Date().toISOString().slice(0, 10)}
                  className="custom-input w-full h-12 min-h-[48px]"
                />
                {error && <span className="text-xs text-error mt-2 font-bold flex items-center gap-1.5"><Icon name="warning" size={14} className="text-error" /> {error}</span>}
              </div>
              <div className="flex justify-between gap-4 mt-6">
                <button onClick={handleBack} className="btn btn-ghost flex-1 h-12 min-h-[48px] font-bold">Back</button>
                <button onClick={handleNext} className="custom-btn-primary flex-1 h-12 min-h-[48px] text-white">Calculate Due Date ➔</button>
              </div>
            </div>
          )}

          {/* Step: Loading */}
          {step === 'loading' && (
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <h2 className="text-xl font-display font-extrabold text-primary">Calculating your timeline...</h2>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <span 
                  className={`transition-all duration-200 transform ${
                    isTransitioning ? 'opacity-0 blur-sm scale-90' : 'opacity-100 blur-0 scale-100'
                  }`}
                >
                  <Icon name={LOADING_STEPS[currentStepIndex].icon} size={36} className="text-primary" />
                </span>
              </div>

              <div className="min-h-[48px] flex items-center justify-center">
                <p 
                  className={`text-sm font-semibold text-neutral transition-all duration-200 ${
                    isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
                  }`}
                >
                  {LOADING_STEPS[currentStepIndex].text}
                </p>
              </div>
              
              <p className="text-xs text-neutral/50 italic font-semibold">
                Setting up needed items for a smooth pregnancy journey...
              </p>
            </div>
          )}

          {/* Step 3: Result Summary & Save */}
          {step === 3 && (
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-2xl font-display font-extrabold text-primary">Your pregnancy tracker is ready!</h2>
              <p className="text-sm text-neutral/80 font-semibold">Based on your LMP, here is your estimated timeline:</p>
              
              <div className="bg-secondary/10 border-2 border-secondary/15 rounded-2xl p-5 my-2 text-left">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-neutral/50 tracking-wider">Estimated Due Date (EDD)</p>
                  <h3 className="text-xl font-display font-black text-primary mt-0.5">{formattedBirthDate()}</h3>
                </div>
                <div className="border-t border-dashed border-primary/20 pt-3">
                  <p className="text-sm text-neutral font-semibold">
                    You are currently in <span className="font-extrabold text-primary text-base">Week {estimatedWeek()}</span> of pregnancy!
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral/50 italic font-semibold">Ready to begin tracking your journey?</p>
              <div className="flex justify-between gap-4 mt-4">
                <button onClick={handleBack} className="btn btn-ghost flex-1 h-12 min-h-[48px] font-bold">Back</button>
                <button onClick={handleFinish} className="custom-btn-primary flex-1 h-12 min-h-[48px] text-white">Open Dashboard ➔</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
