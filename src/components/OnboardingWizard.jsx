import React, { useState } from 'react'
import { calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [periodDate, setPeriodDate] = useState('')
  const [error, setError] = useState('')

  const handleNext = () => {
    if (step === 2 && !periodDate) {
      setError('Please select a date to find your due date.')
      return
    }
    setError('')
    setStep((prev) => prev + 1)
  }

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
        <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Welcome</li>
        <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Your Info</li>
        <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Summary</li>
      </ul>

      {/* Step 1: Welcome & Setup */}
      {step === 1 && (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-primary">Welcome to Bump Buddy!</h2>
          <p className="text-sm text-neutral leading-relaxed">
            We're so excited to help you track your pregnancy journey. Bump Buddy lets you look up weekly growth guides, keep a personalized checklist, and check development highlights.
          </p>
          <div className="bg-primary/5 rounded-xl p-4 text-left border border-primary/10">
            <h3 className="text-sm font-semibold text-primary mb-1">🔒 Completely Private</h3>
            <p className="text-xs text-neutral">No logins, accounts, or sharing required. All your information stays stored securely on your own device.</p>
          </div>
          <button 
            onClick={handleNext}
            className="btn btn-primary w-full mt-4 h-12 min-h-[48px]"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Step 2: Date Input */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-primary text-center">Let's find your due date</h2>
          <p className="text-sm text-neutral text-center leading-relaxed">
            When did the first day of your last period start? We'll use this date to follow your pregnancy week-by-week.
          </p>
          <div className="form-control w-full mt-2">
            <label className="label font-bold text-xs uppercase tracking-wide text-neutral">
              Start Date of Last Period
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
            <button onClick={handleNext} className="btn btn-primary flex-1 h-12 min-h-[48px]">Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Result Summary & Save */}
      {step === 3 && (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-primary">All set! 🎉</h2>
          <p className="text-sm text-neutral">Here is your calculated arrival date:</p>
          
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
            <button onClick={handleFinish} className="btn btn-primary flex-1 h-12 min-h-[48px]">Let's Go! ➔</button>
          </div>
        </div>
      )}
    </div>
  )
}
