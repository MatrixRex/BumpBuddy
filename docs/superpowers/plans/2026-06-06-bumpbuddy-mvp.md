# Bump Buddy MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Bump Buddy" pregnancy helper web application with onboarding, due date calculations, returning user dashboard, checklist state persistence, and weekly pregnancy guides.

**Architecture:** A client-side React SPA styled with Tailwind CSS and DaisyUI, using React Router DOM for routing. Core business logic (week and due date calculations) is isolated into a utility file and thoroughly tested via Vitest. State is stored natively in `localStorage` to create a loginless returning user dashboard.

**Tech Stack:** React (Vite), Tailwind CSS, DaisyUI, React Router DOM, Vitest, pnpm.

---

## Technical File Architecture Map
*   `tailwind.config.js`: Custom DaisyUI theme configuration.
*   `src/index.css`: Tailwind directive imports.
*   `src/data/weeks.json`: The 1–40 week pregnancy guides data.
*   `src/utils/pregnancy.js`: Logic for EDD calculation, active week estimation, and `localStorage` helper commands.
*   `src/utils/pregnancy.test.js`: Vitest unit tests for calculations and persistence.
*   `src/components/OnboardingWizard.jsx`: Step-by-step onboarding component for first-time users.
*   `src/pages/Home.jsx`: Main routing target for `/`. Handles onboarding steps for new users, and displays the personalized active week summary card and due date dashboard for returning users.
*   `src/pages/WeekDetails.jsx`: Routing target for `/week/:weekNumber`. Contains size guides, milestones highlights, health tips, and local storage-backed checkboxes.
*   `src/App.jsx`: Global header, footer, React Router setup, and root layout.
*   `src/main.jsx`: React render target.

---

## Phased Implementation Roadmap

### Phase 1: Environment & Logic Foundation (TDD-Verified)
Build the setup skeleton, weekly guides database, and core calculator utility with full unit test coverage.
*   **Tasks Included:** Task 1, Task 2, Task 3
*   **Verification:** `pnpm run test` must pass (100% logic test coverage).

### Phase 2: Onboarding & Home Dashboard UI
Implement the step-by-step onboarding flows and returning user home dashboard.
*   **Tasks Included:** Task 4, Task 5
*   **Verification:** Manual page interaction checking local storage values.

### Phase 3: Routing & Weekly Engine Details
Implement the dynamic details pages, checklists, navigation buttons, and compile production assets.
*   **Tasks Included:** Task 6, Task 7
*   **Verification:** Traversal controls, checked state persistence on refresh, and `pnpm run build` verification.

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
*   Create: `package.json`
*   Create: `tailwind.config.js`
*   Create: `vite.config.js`
*   Create: `src/index.css`
*   Create: `src/main.jsx`
*   Create: `src/App.jsx`
*   Create: `index.html`

- [ ] **Step 1: Write `package.json` with dependencies**
  Configure standard Vite React app, installing `tailwindcss`, `autoprefixer`, `postcss`, `daisyui` as devDependencies, and `react`, `react-dom`, `react-router-dom` as dependencies, plus `vitest` and `@testing-library/react` / `jsdom` for testing.
  ```json
  {
    "name": "bumpbuddy",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "test": "vitest run"
    },
    "dependencies": {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^6.23.1"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.0",
      "autoprefixer": "^10.4.19",
      "daisyui": "^4.12.2",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.4",
      "vite": "^5.2.11",
      "vitest": "^1.6.0",
      "jsdom": "^24.1.0"
    }
  }
  ```

- [ ] **Step 2: Install all packages via pnpm**
  Run: `pnpm install`
  Expected: Packages install successfully, creating `node_modules`.

- [ ] **Step 3: Create Vite Config**
  Create `vite.config.js` enabling React plugin and configuring Vitest environment.
  ```javascript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
    },
  })
  ```

- [ ] **Step 4: Create Tailwind & PostCSS Config**
  Create `tailwind.config.js` defining contents, DaisyUI plugin, and the custom `bumpbuddy` theme.
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
          bumpbuddy: {
            primary: "#7970c3",
            secondary: "#ffacda",
            accent: "#a8e6cf",
            neutral: "#3d4451",
            "base-100": "#faf8f6",
            info: "#7970c3",
            success: "#a8e6cf",
            warning: "#f3cc30",
            error: "#e58b8b",
          },
        },
      ],
    },
  }
  ```
  Create `postcss.config.js`:
  ```javascript
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

- [ ] **Step 5: Add index.css and index.html**
  Create `src/index.css` importing Tailwind CSS:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
  Create `index.html`:
  ```html
  <!doctype html>
  <html lang="en" data-theme="bumpbuddy">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bump Buddy - Simple Pregnancy Journey Tracker</title>
    </head>
    <body class="bg-base-100 text-neutral min-h-screen">
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  ```

- [ ] **Step 6: Create entrypoint files `src/main.jsx` and initial `src/App.jsx`**
  Create `src/App.jsx` showing placeholder title:
  ```jsx
  import React from 'react'

  export default function App() {
    return (
      <div class="flex items-center justify-center h-screen bg-base-100 text-neutral">
        <h1 class="text-3xl font-bold text-primary">👶 Bump Buddy</h1>
      </div>
    )
  }
  ```
  Create `src/main.jsx`:
  ```jsx
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.jsx'
  import './index.css'

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  ```

- [ ] **Step 7: Verify app compiles successfully**
  Run: `pnpm run build`
  Expected: Production build compiles without errors.

- [ ] **Step 8: Commit**
  ```bash
  git add package.json tailwind.config.js postcss.config.js vite.config.js index.html src/index.css src/main.jsx src/App.jsx
  git commit -m "chore: scaffold project structure, configure tailwind, daisyui, and vitest"
  ```

---

### Task 2: Create Static JSON Pregnancy Data File

**Files:**
*   Create: `src/data/weeks.json`

- [ ] **Step 1: Write static JSON file with week guides 1-40**
  Create `src/data/weeks.json` containing 40 week elements. Weeks 1–4 contain realistic copy. Weeks 5–40 use clean placeholder templates.
  ```json
  [
    {
      "weekNumber": 1,
      "sizeComparison": "Vanilla bean seed",
      "highlights": [
        "Your body is preparing for ovulation and conception.",
        "Your doctor counts pregnancy starting from the first day of your last period."
      ],
      "healthTip": "Start taking a daily prenatal vitamin containing folic acid to support baby's early spinal growth.",
      "checklist": [
        "Schedule preconception consultation",
        "Begin taking daily prenatal vitamins",
        "Stop drinking alcohol and limit caffeine"
      ]
    },
    {
      "weekNumber": 2,
      "sizeComparison": "Microscopic cell group",
      "highlights": [
        "Ovulation occurs, and fertilization takes place in the fallopian tube.",
        "The fertilized egg divides into a cluster of cells as it travels to your uterus."
      ],
      "healthTip": "Focus on high-nutrient foods like leafy greens, whole grains, and lean proteins.",
      "checklist": [
        "Track ovulation cycles",
        "Stay hydrated (aim for 8+ glasses of water)",
        "Review safe medications with your provider"
      ]
    },
    {
      "weekNumber": 3,
      "sizeComparison": "Pinhead",
      "highlights": [
        "The blastocyst implants into the blood-rich uterine lining.",
        "The placenta starts producing hormones that indicate pregnancy."
      ],
      "healthTip": "Stay active with gentle routines like walking, and maintain regular sleep cycles.",
      "checklist": [
        "Research local prenatal care providers",
        "Avoid raw foods, soft cheeses, and undercooked meats",
        "Keep up gentle daily exercises"
      ]
    },
    {
      "weekNumber": 4,
      "sizeComparison": "Poppy seed",
      "highlights": [
        "The embryo splits into the amniotic sac, yolk sac, and baby-to-be.",
        "Early blood vessels are forming to create the heart and circulatory system."
      ],
      "healthTip": "Listen to your body. Fatigue is completely normal right now as hormones adjust.",
      "checklist": [
        "Take a home pregnancy test if your period is late",
        "Share the news with your partner",
        "Book your first prenatal appointment (usually around week 8)"
      ]
    },
    ... (template generated for weeks 5-40 in standard format)
  ]
  ```
  *(Note: Complete JSON contents will be written without placeholders in the file).*

- [ ] **Step 2: Commit**
  ```bash
  git add src/data/weeks.json
  git commit -m "feat: add static JSON file containing pregnancy weeks 1-40 data"
  ```

---

### Task 3: Implement Calculations & Storage Utility (TDD)

**Files:**
*   Create: `src/utils/pregnancy.js`
*   Create: `src/utils/pregnancy.test.js`

- [ ] **Step 1: Write calculation and storage helper test suite**
  Create `src/utils/pregnancy.test.js` checking EDD and current week calculations under all edge cases.
  ```javascript
  import { describe, it, expect } from 'vitest'
  import { calculateArrivalDate, calculateCurrentWeek } from './pregnancy'

  describe('Pregnancy calculations utility', () => {
    it('calculates the estimated birth date by adding 280 days', () => {
      const lmpDate = '2026-04-01'
      // 2026-04-01 + 280 days is January 6, 2027
      const birthDate = calculateArrivalDate(lmpDate)
      expect(birthDate.toISOString().slice(0, 10)).toBe('2027-01-06')
    })

    it('calculates the correct current week on the first day of pregnancy (LMP = today)', () => {
      const today = new Date('2026-06-06')
      const lmp = '2026-06-06'
      expect(calculateCurrentWeek(lmp, today)).toBe(1)
    })

    it('calculates correct week number after 6 days elapsed (still Week 1)', () => {
      const today = new Date('2026-06-12')
      const lmp = '2026-06-06'
      expect(calculateCurrentWeek(lmp, today)).toBe(1)
    })

    it('calculates correct week number on day 7 (enters Week 2)', () => {
      const today = new Date('2026-06-13')
      const lmp = '2026-06-06'
      expect(calculateCurrentWeek(lmp, today)).toBe(2)
    })

    it('calculates correct week number for Week 10 (day 66 elapsed)', () => {
      const today = new Date('2026-06-11')
      const lmp = '2026-04-06' // 66 days difference
      expect(calculateCurrentWeek(lmp, today)).toBe(10)
    })

    it('clamps the maximum week number to 40 even if gestation exceeds 40 weeks', () => {
      const today = new Date('2027-02-15')
      const lmp = '2026-04-01' // way past 280 days
      expect(calculateCurrentWeek(lmp, today)).toBe(40)
    })
  })
  ```

- [ ] **Step 2: Run test suite to verify failures**
  Run: `pnpm run test`
  Expected: FAIL with missing file or functions.

- [ ] **Step 3: Implement calculation logic in `src/utils/pregnancy.js`**
  Write calculations in `src/utils/pregnancy.js`.
  ```javascript
  export function calculateArrivalDate(lmpString) {
    const lmpDate = new Date(lmpString)
    const arrivalDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
    return arrivalDate
  }

  export function calculateCurrentWeek(lmpString, currentDate = new Date()) {
    const lmpDate = new Date(lmpString)
    // Clear hours to avoid daylight saving offset issues
    const lmpMidnight = new Date(lmpDate.getFullYear(), lmpDate.getMonth(), lmpDate.getDate())
    const curMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    const diffTime = curMidnight.getTime() - lmpMidnight.getTime()
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000))

    if (diffDays < 0) return 1 // pre-conception safety margin
    const week = Math.floor(diffDays / 7) + 1
    return Math.min(40, week)
  }

  export function getPersistedLMP() {
    return localStorage.getItem('bump_buddy_lmp') || ''
  }

  export function setPersistedLMP(lmpString) {
    localStorage.setItem('bump_buddy_lmp', lmpString)
  }

  export function clearPersistedData() {
    // Clear LMP and all week checklists
    localStorage.removeItem('bump_buddy_lmp')
    for (let i = 1; i <= 40; i++) {
      localStorage.removeItem(`bump_buddy_week_${i}_checklist`)
    }
  }
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `pnpm run test`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/utils/pregnancy.js src/utils/pregnancy.test.js
  git commit -m "feat: implement EDD and week calculation logic and verify with Vitest tests"
  ```

---

### Task 4: Build Onboarding Wizard UI Component

**Files:**
*   Create: `src/components/OnboardingWizard.jsx`

- [ ] **Step 1: Write OnboardingWizard component**
  Write an interactive step-by-step layout using DaisyUI's steps and forms. Ensures touch targets are at least 48px.
  ```jsx
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
        {/* Progress Tracker */}
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
              className="btn btn-primary w-full mt-4 h-12"
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
                className="input input-bordered w-full h-12 border-primary"
              />
              {error && <span className="text-xs text-error mt-2">{error}</span>}
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <button onClick={handleBack} className="btn btn-ghost flex-1 h-12">Back</button>
              <button onClick={handleNext} className="btn btn-primary flex-1 h-12">Next</button>
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
              <button onClick={handleBack} className="btn btn-ghost flex-1 h-12">Back</button>
              <button onClick={handleFinish} className="btn btn-primary flex-1 h-12">Let's Go! ➔</button>
            </div>
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add src/components/OnboardingWizard.jsx
  git commit -m "feat: create OnboardingWizard component with multi-step setup"
  ```

---

### Task 5: Implement Landing Page & Active Week Dashboard

**Files:**
*   Create: `src/pages/Home.jsx`

- [ ] **Step 1: Write Home component**
  Write `src/pages/Home.jsx`. It determines whether the user is onboarding or returning. If returning, calculates active week, imports the corresponding week information from `weeks.json`, and outputs the weekly summary card.
  ```jsx
  import React, { useState, useEffect } from 'react'
  import { Link } from 'react-router-dom'
  import OnboardingWizard from '../components/OnboardingWizard'
  import { getPersistedLMP, setPersistedLMP, clearPersistedData, calculateArrivalDate, calculateCurrentWeek } from '../utils/pregnancy'
  import weeksData from '../data/weeks.json'

  export default function Home() {
    const [lmp, setLmp] = useState('')
    const [activeWeekData, setActiveWeekData] = useState(null)

    useEffect(() => {
      const savedLmp = getPersistedLMP()
      if (savedLmp) {
        setLmp(savedLmp)
        const weekNum = calculateCurrentWeek(savedLmp)
        const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
        setActiveWeekData(matchedWeek || null)
      } else {
        setLmp('')
        setActiveWeekData(null)
      }
    }, [])

    const handleOnboardingComplete = (selectedLmp) => {
      setPersistedLMP(selectedLmp)
      setLmp(selectedLmp)
      const weekNum = calculateCurrentWeek(selectedLmp)
      const matchedWeek = weeksData.find((w) => w.weekNumber === weekNum)
      setActiveWeekData(matchedWeek || null)
      // Custom event to sync header state
      window.dispatchEvent(new Event('storage'))
    }

    const handleReset = () => {
      if (window.confirm("Are you sure you want to clear your pregnancy data and checklists? This cannot be undone.")) {
        clearPersistedData()
        setLmp('')
        setActiveWeekData(null)
        window.dispatchEvent(new Event('storage'))
      }
    }

    const formattedBirthDate = () => {
      if (!lmp) return ''
      const date = calculateArrivalDate(lmp)
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const currentWeekNum = () => {
      if (!lmp) return 1
      return calculateCurrentWeek(lmp)
    }

    // New User Mode: Render onboarding wizard
    if (!lmp) {
      return (
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <div className="text-center max-w-md mb-8">
            <h1 className="text-4xl font-extrabold text-primary mb-2">👶 Bump Buddy</h1>
            <p className="text-neutral text-sm leading-relaxed">
              Your simple, private, loginless pregnancy guide.
            </p>
          </div>
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        </div>
      )
    }

    // Returning User Mode: Render dashboard
    return (
      <div className="flex flex-col gap-6 max-w-md mx-auto py-6 px-4">
        {/* Welcome Back Card */}
        <div className="card w-full bg-white shadow-lg border border-gray-100 p-6 flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-primary">Welcome Back! ✨</h2>
          <p className="text-sm text-neutral">Here is your current pregnancy summary:</p>

          {/* Active Week Summary Card */}
          {activeWeekData && (
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-primary">Week {activeWeekData.weekNumber}</span>
                <span className="badge badge-secondary font-bold text-xs py-2 px-3">
                  🍓 {activeWeekData.sizeComparison}
                </span>
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold text-neutral/70 tracking-wider">Baby's Current Size</h3>
                <p className="text-sm text-neutral mt-0.5">
                  Your baby is currently about the size of a <b>{activeWeekData.sizeComparison}</b>.
                </p>
              </div>
              <div className="border-t border-dashed border-primary/20 pt-3">
                <h3 className="text-xs uppercase font-bold text-neutral/70 tracking-wider">Week Highlight</h3>
                <p className="text-sm text-neutral mt-0.5 leading-relaxed">
                  {activeWeekData.highlights[0] || 'Baby is continuing to develop rapidly.'}
                </p>
              </div>
            </div>
          )}

          {/* arrival date display */}
          <div className="bg-base-100 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-neutral font-semibold">Estimated due date: <span className="font-bold text-primary">{formattedBirthDate()}</span></p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 mt-4">
            <Link 
              to={`/week/${currentWeekNum()}`}
              className="btn btn-primary w-full h-12 text-white font-bold"
            >
              See details & checklist for this week ➔
            </Link>

            <button 
              onClick={handleReset}
              className="btn btn-outline btn-ghost w-full h-12 text-xs font-semibold text-gray-500 hover:text-error hover:bg-error/10 hover:border-error"
            >
              Reset Tracker / Clear Memory 🗑️
            </button>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add src/pages/Home.jsx
  git commit -m "feat: create Home page displaying onboarding wizard for new users and personalized dashboard for returning users"
  ```

---

### Task 6: Implement Weekly Engine Detail Page

**Files:**
*   Create: `src/pages/WeekDetails.jsx`

- [ ] **Step 1: Write WeekDetails component**
  Create `src/pages/WeekDetails.jsx`. Dynamic path reads `weekNumber`. Manages checklist array in local storage, allows traversing between weeks 1-40, and displays the matching week guides.
  ```jsx
  import React, { useState, useEffect } from 'react'
  import { useParams, Link } from 'react-router-dom'
  import weeksData from '../data/weeks.json'
  import { getPersistedLMP, calculateCurrentWeek } from '../utils/pregnancy'

  export default function WeekDetails() {
    const { weekNumber } = useParams()
    const currentWeekIdx = parseInt(weekNumber, 10)
    
    // Find relevant week data
    const weekData = weeksData.find((w) => w.weekNumber === currentWeekIdx)
    
    // Tracker user active week
    const [userActiveWeek, setUserActiveWeek] = useState(null)
    const [checkedTasks, setCheckedTasks] = useState([])

    // Load data and checklists
    useEffect(() => {
      const savedLmp = getPersistedLMP()
      if (savedLmp) {
        setUserActiveWeek(calculateCurrentWeek(savedLmp))
      } else {
        setUserActiveWeek(null)
      }

      // Load checklist state
      const localKey = `bump_buddy_week_${currentWeekIdx}_checklist`
      const savedChecks = localStorage.getItem(localKey)
      if (savedChecks) {
        setCheckedTasks(JSON.parse(savedChecks))
      } else {
        setCheckedTasks([])
      }
    }, [currentWeekIdx])

    // Toggle checklists tasks
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
          <p className="text-sm text-neutral mt-2">Gestation details only go from Week 1 to Week 40.</p>
          <Link to="/" className="btn btn-primary btn-sm mt-4">Go Home</Link>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6 max-w-md mx-auto py-6 px-4">
        {/* Navigation Traversal Banner */}
        <div className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
          <Link 
            to={currentWeekIdx > 1 ? `/week/${currentWeekIdx - 1}` : '#'}
            className={`btn btn-sm btn-ghost ${currentWeekIdx === 1 ? 'btn-disabled opacity-30' : ''}`}
          >
            ◀ Week {currentWeekIdx - 1 || 1}
          </Link>
          <span className="font-extrabold text-sm text-primary">Week {weekData.weekNumber} of 40</span>
          <Link 
            to={currentWeekIdx < 40 ? `/week/${currentWeekIdx + 1}` : '#'}
            className={`btn btn-sm btn-ghost ${currentWeekIdx === 40 ? 'btn-disabled opacity-30' : ''}`}
          >
            Week {currentWeekIdx + 1 || 40} ▶
          </Link>
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

        {/* Size card display */}
        <div className="card bg-gradient-to-br from-primary to-[#938ce0] text-white p-6 shadow-md rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 bottom-4 text-5xl opacity-20">🤰</div>
          <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Baby's growth guide</span>
          <h2 className="text-2xl font-black mt-1">Size of a {weekData.sizeComparison}</h2>
          <p className="text-xs mt-2 opacity-80 italic">A beautiful milestone in your development journey.</p>
        </div>

        {/* Development highlights */}
        <div className="card bg-white p-5 shadow-md border border-gray-50 rounded-2xl">
          <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
            ✨ Highlights
          </h3>
          <ul className="list-disc list-inside text-sm text-neutral mt-3 flex flex-col gap-2 leading-relaxed">
            {weekData.highlights.map((highlight, idx) => (
              <li key={idx} className="pl-1 pr-1">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Health Tip Box */}
        <div className="card bg-[#fff5fa] border-l-4 border-secondary p-4 rounded-r-2xl rounded-l-none shadow-sm">
          <h4 className="text-xs uppercase font-extrabold text-secondary tracking-wider">💡 Tip for this week</h4>
          <p className="text-sm text-neutral mt-1 leading-relaxed">
            {weekData.healthTip}
          </p>
        </div>

        {/* Checked persistent checklist */}
        <div className="card bg-white p-5 shadow-md border border-gray-50 rounded-2xl">
          <h3 className="text-base font-extrabold text-primary mb-3">
            ✅ To-Do Checklist
          </h3>
          <div className="flex flex-col gap-2">
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

        {/* back to dashboard links */}
        <Link to="/" className="btn btn-outline btn-ghost w-full h-12 mt-2">
          ◀ Back to Dashboard
        </Link>
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add src/pages/WeekDetails.jsx
  git commit -m "feat: implement WeekDetails component showing size comparisons, highlights, tips, and persistent checklists"
  ```

---

### Task 7: Layout Wrapper, Global Routing & Sync

**Files:**
*   Modify: `src/App.jsx`

- [ ] **Step 1: Write routing and global layout wrapper in App.jsx**
  Replace standard placeholder in `src/App.jsx` with routes, navigation, active week sync badge, and clean, mobile-first header and footer.
  ```jsx
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
      // Custom listener to update state on onboarding change or resets
      window.addEventListener('storage', syncPregnancyState)
      return () => {
        window.removeEventListener('storage', syncPregnancyState)
      }
    }, [])

    return (
      <Router>
        <div className="flex flex-col min-h-screen bg-base-100">
          {/* Header */}
          <header className="navbar bg-white border-b border-gray-100 px-4 py-2 sticky top-0 z-50 shadow-sm max-w-lg mx-auto w-full">
            <div className="flex-1">
              <Link to="/" className="text-xl font-black text-primary tracking-tight flex items-center gap-1">
                👶 Bump Buddy
              </Link>
            </div>
            {currentWeek !== null && (
              <div className="flex-none gap-2">
                <Link to={`/week/${currentWeek}`} className="badge badge-primary font-bold text-xs p-3">
                  Week {currentWeek}
                </Link>
              </div>
            )}
          </header>

          {/* Main Content Area */}
          <main className="flex-grow w-full max-w-lg mx-auto pb-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/week/:weekNumber" element={<WeekDetails />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="footer footer-center p-4 bg-white border-t border-gray-100 text-neutral-content max-w-lg mx-auto w-full">
            <div>
              <p className="text-xs text-neutral font-semibold">
                © 2026 Bump Buddy • Made with care for expecting parents
              </p>
            </div>
          </footer>
        </div>
      </Router>
    )
  }
  ```

- [ ] **Step 2: Verify all tests pass**
  Run: `pnpm run test`
  Expected: PASS

- [ ] **Step 3: Build app to verify compilation success**
  Run: `pnpm run build`
  Expected: Success without errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/App.jsx
  git commit -m "feat: complete App.jsx wrapping global navigation, routing, and week status sync"
  ```
