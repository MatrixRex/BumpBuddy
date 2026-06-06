import React, { useState, useEffect } from 'react'
import { calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'

const LOADING_STEPS = [
  { text: "Analyzing your Last Menstrual Period...", icon: "📅" },
  { text: "Applying Naegele's Rule for calculation...", icon: "🧮" },
  { text: "Determining Estimated Due Date (EDD)...", icon: "⏳" },
  { text: "Tailoring weekly baby growth comparisons...", icon: "🍓" },
  { text: "Configuring customized checklist templates...", icon: "📋" },
  { text: "Almost ready! Preparing dashboard...", icon: "✨" }
]

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [periodDate, setPeriodDate] = useState('')
  const [error, setError] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleNext = () => {
    if (step === 2 && !periodDate) {
      setError('Please select a date to find your due date.')
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
      // Start exit animation (blur + fade out) 200ms before text changes
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
    }, 800) // Total 800ms per step (600ms stable + 200ms transition)

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
    <div className="card w-full bg-white shadow-xl border border-gray-100 p-6 max-w-md mx-auto">
      {/* Progress Steps Tracker */}
      <ul className="steps steps-horizontal w-full mb-8 text-xs font-semibold">
        <li className={`step ${step >= 1 ? 'step-secondary' : ''}`}>Welcome</li>
        <li className={`step ${step >= 2 || step === 'loading' ? 'step-secondary' : ''}`}>Your Info</li>
        <li className={`step ${step >= 3 ? 'step-secondary' : ''}`}>Summary</li>
      </ul>

      {/* Step 1: Welcome & Setup */}
      {step === 1 && (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-primary">Welcome to Bump Buddy!</h2>
          <p className="text-sm text-neutral leading-relaxed">
            A simple way to look up weekly growth guides, track highlights, and manage your checklist without an account.
          </p>
          <button 
            onClick={handleNext}
            className="btn btn-primary w-full mt-4 h-12 min-h-[48px]"
          >
            Calculate My Due Date ➔
          </button>
        </div>
      )}

      {/* Step 2: Date Input */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-primary text-center">When was the start of your last period?</h2>
          <p className="text-sm text-neutral text-center leading-relaxed">
            We'll use your Last Menstrual Period (LMP) to calculate your estimated due date and tailor your weekly guides.
          </p>
          <div className="form-control w-full mt-2">
            <label className="label font-bold text-xs uppercase tracking-wide text-neutral">
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
              className="input input-bordered w-full h-12 min-h-[48px] border-primary"
            />
            {error && <span className="text-xs text-error mt-2">{error}</span>}
          </div>
          <div className="flex justify-between gap-4 mt-6">
            <button onClick={handleBack} className="btn btn-ghost flex-1 h-12 min-h-[48px]">Back</button>
            <button onClick={handleNext} className="btn btn-primary flex-1 h-12 min-h-[48px]">Calculate Due Date ➔</button>
          </div>
        </div>
      )}

      {/* Step: Loading */}
      {step === 'loading' && (
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <h2 className="text-xl font-bold text-primary">Calculating your timeline...</h2>
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Pink/Rose pregnancy wheel spinner */}
            <div className="absolute w-20 h-20 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin"></div>
            
            {/* Animating center icon */}
            <span 
              className={`text-3xl transition-all duration-200 transform ${
                isTransitioning ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'
              }`}
            >
              {LOADING_STEPS[currentStepIndex].icon}
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
          
          <p className="text-xs text-neutral/60 italic">
            Setting up needed items for a smooth pregnancy journey...
          </p>
        </div>
      )}

      {/* Step 3: Result Summary & Save */}
      {step === 3 && (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-primary">Your pregnancy tracker is ready!</h2>
          <p className="text-sm text-neutral">Based on your LMP, here is your estimated timeline:</p>
          
          <div className="bg-base-100 border-2 border-secondary/40 rounded-2xl p-5 my-2 flex flex-col gap-3">
            <div>
              <p className="text-xs uppercase font-semibold text-neutral tracking-wider">Estimated Due Date</p>
              <h3 className="text-xl font-extrabold text-primary">{formattedBirthDate()}</h3>
            </div>
            <div className="border-t border-dashed border-secondary/40 pt-3">
              <p className="text-sm text-neutral">
                You are currently in <span className="font-bold text-primary">Week {estimatedWeek()}</span> of pregnancy!
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral italic">Ready to begin tracking your journey?</p>
          <div className="flex justify-between gap-4 mt-4">
            <button onClick={handleBack} className="btn btn-ghost flex-1 h-12 min-h-[48px]">Back</button>
            <button onClick={handleFinish} className="btn btn-primary flex-1 h-12 min-h-[48px]">Open My Pregnancy Dashboard ➔</button>
          </div>
        </div>
      )}
    </div>
  )
}
