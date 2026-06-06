# Calculated Due Date Loading Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fake calculation delay of ~6 seconds with custom loading animations when calculating the Estimated Due Date (EDD). Also, update the DaisyUI step progress tracker active colors to secondary pink.

**Architecture:** Use an intermediate `'loading'` wizard step state, managing transitions with a `useEffect` interval loop. Visual transition exit states are handled with a `isTransitioning` state flag toggled 200ms before each text/icon change.

**Tech Stack:** React, Tailwind CSS, DaisyUI

---

### Task 1: OnboardingWizard Loading State Implementation

**Files:**
- Modify: `src/components/OnboardingWizard.jsx`

- [ ] **Step 1: Add LOADING_STEPS configuration, state variables, and step tracker update**

Modify `src/components/OnboardingWizard.jsx` to define the configuration array, add states, and update the step progress tracker colors.

```javascript
// Add before the component definition:
const LOADING_STEPS = [
  { text: "Analyzing your Last Menstrual Period...", icon: "📅" },
  { text: "Applying Naegele's Rule for calculation...", icon: "🧮" },
  { text: "Determining Estimated Due Date (EDD)...", icon: "⏳" },
  { text: "Tailoring weekly baby growth comparisons...", icon: "🍓" },
  { text: "Configuring customized checklist templates...", icon: "📋" },
  { text: "Almost ready! Preparing dashboard...", icon: "✨" }
]
```

Modify the component body to include state variables and update step tracker classes:
```javascript
  const [step, setStep] = useState(1)
  const [periodDate, setPeriodDate] = useState('')
  const [error, setError] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
```

And update the steps tracker block:
```javascript
      {/* Progress Steps Tracker */}
      <ul className="steps steps-horizontal w-full mb-8 text-xs font-semibold">
        <li className={`step ${step >= 1 ? 'step-secondary' : ''}`}>Welcome</li>
        <li className={`step ${step >= 2 || step === 'loading' ? 'step-secondary' : ''}`}>Your Info</li>
        <li className={`step ${step >= 3 ? 'step-secondary' : ''}`}>Summary</li>
      </ul>
```

- [ ] **Step 2: Modify handleNext and add useEffect transition hook**

Update `handleNext` to set step to `'loading'` when advancing from Step 2:
```javascript
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
```

Add the `useEffect` hook in `OnboardingWizard` to manage message transitions:
```javascript
  React.useEffect(() => {
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
    }, 800) // Total 800ms per step (600ms stable + 200ms transition transition)

    return () => clearInterval(interval)
  }, [step])
```

- [ ] **Step 3: Render the loading view**

Add the JSX rendering block for `step === 'loading'` right after the Step 2 block:
```jsx
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
```

- [ ] **Step 4: Run test suite to verify no regressions**

Run command: `pnpm test`
Expected: Passes successfully.

- [ ] **Step 5: Commit changes**

Run command: `git add src/components/OnboardingWizard.jsx`
Run command: `git commit -m "feat: add calculated due date loading delay and update steps tracker colors"`
