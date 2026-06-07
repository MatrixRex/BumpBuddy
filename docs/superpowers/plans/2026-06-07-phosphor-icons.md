# Phosphor Icons Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace temporary emojis in Bump Buddy with proper Phosphor Icons using a centralized wrapper component.

**Architecture:** Create a centralized icon registry component in `src/components/Icon.jsx` which maps logical names to Phosphor icons, and use it across the codebase.

**Tech Stack:** React 18, @phosphor-icons/react, Tailwind CSS

---

### Task 1: Install @phosphor-icons/react

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install `@phosphor-icons/react` package**

Run: `pnpm add @phosphor-icons/react`
Expected: Installation completes successfully and package.json is updated.

- [ ] **Step 2: Verify package.json contains dependency**

View package.json to ensure `@phosphor-icons/react` is present under `"dependencies"`.

- [ ] **Step 3: Commit installation changes**

Run:
```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @phosphor-icons/react dependency"
```

---

### Task 2: Create Centralized Icon Component

**Files:**
- Create: `src/components/Icon.jsx`

- [ ] **Step 1: Create the registry file**

Create the file `src/components/Icon.jsx` with the following content:

```jsx
import React from 'react'
import {
  Baby,
  CalendarHeart,
  Calculator,
  Hourglass,
  Scale,
  ClipboardText,
  Sparkles,
  Flower,
  BookOpen,
  MapPin,
  Info,
  CheckCircle,
  Confetti,
  Lock,
  Warning,
  Lightbulb
} from '@phosphor-icons/react'

const ICON_MAP = {
  baby: { component: Baby, defaultWeight: 'fill' },
  calendar: { component: CalendarHeart, defaultWeight: 'regular' },
  calculator: { component: Calculator, defaultWeight: 'regular' },
  hourglass: { component: Hourglass, defaultWeight: 'regular' },
  scale: { component: Scale, defaultWeight: 'regular' },
  clipboard: { component: ClipboardText, defaultWeight: 'regular' },
  sparkles: { component: Sparkles, defaultWeight: 'fill' },
  flower: { component: Flower, defaultWeight: 'fill' },
  book: { component: BookOpen, defaultWeight: 'regular' },
  mapPin: { component: MapPin, defaultWeight: 'regular' },
  info: { component: Info, defaultWeight: 'fill' },
  check: { component: CheckCircle, defaultWeight: 'fill' },
  confetti: { component: Confetti, defaultWeight: 'fill' },
  lock: { component: Lock, defaultWeight: 'fill' },
  warning: { component: Warning, defaultWeight: 'fill' },
  lightbulb: { component: Lightbulb, defaultWeight: 'fill' }
}

export default function Icon({ name, size = 20, weight, className = '', ...props }) {
  const iconConfig = ICON_MAP[name]
  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in Icon registry.`)
    return null
  }

  const IconComponent = iconConfig.component
  const resolvedWeight = weight || iconConfig.defaultWeight

  return (
    <IconComponent 
      size={size} 
      weight={resolvedWeight} 
      className={className} 
      {...props} 
    />
  )
}
```

- [ ] **Step 2: Commit Icon component**

Run:
```bash
git add src/components/Icon.jsx
git commit -m "feat: add centralized Icon component registry"
```

---

### Task 3: Replace Emojis in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Modify App.jsx to import and use Icon**

In `src/App.jsx`, import `Icon` from `./components/Icon`:
```jsx
import Icon from './components/Icon'
```

Replace emojis:
- Around line 51: Replace `👶 Bump Buddy` with `<Icon name="baby" size={24} className="text-primary" /> Bump Buddy`
- Around line 145: Replace `🔒 100% Private` with `<Icon name="lock" size={16} className="text-neutral inline mr-1" /> 100% Private`
- Around line 152: Replace `⚠️ Reset Tracker` with `<Icon name="warning" size={16} className="text-error inline mr-1" /> Reset Tracker`

- [ ] **Step 2: Commit changes to App.jsx**

Run:
```bash
git add src/App.jsx
git commit -m "style: replace emojis with icons in App.jsx"
```

---

### Task 4: Replace Emojis in OnboardingWizard.jsx

**Files:**
- Modify: `src/components/OnboardingWizard.jsx`

- [ ] **Step 1: Modify OnboardingWizard.jsx to import and use Icon**

Import the new `Icon` component:
```jsx
import Icon from './Icon'
```

- [ ] **Step 2: Update LOADING_STEPS array to store icon key**

Modify the `LOADING_STEPS` array:
```javascript
const LOADING_STEPS = [
  { text: "Analyzing your Last Menstrual Period...", icon: "calendar" },
  { text: "Applying Naegele's Rule for calculation...", icon: "calculator" },
  { text: "Determining Estimated Due Date (EDD)...", icon: "hourglass" },
  { text: "Tailoring weekly baby growth comparisons...", icon: "scale" },
  { text: "Configuring customized checklist templates...", icon: "clipboard" },
  { text: "Almost ready! Preparing dashboard...", icon: "sparkles" }
]
```

- [ ] **Step 3: Update Step components to use Icon**

Modify rendering code:
- Loading step icon container (around line 186): Replace `{LOADING_STEPS[currentStepIndex].icon}` with `<Icon name={LOADING_STEPS[currentStepIndex].icon} size={48} className="text-primary" />`
- Left panel title (around line 90): Replace `🌸 Your Companion` with `<Icon name="flower" size={16} className="text-primary inline mr-1.5" /> Your Companion`
- Left panel footer text (around line 112): Replace `👶 Bump Buddy guides` with `<Icon name="baby" size={14} className="text-primary inline mr-1" /> Bump Buddy guides`
- Input error text (around line 172): Replace `⚠️ {error}` with `<div className="flex items-center gap-1.5 text-xs text-error mt-2 font-bold"><Icon name="warning" size={14} className="text-error" /> {error}</div>`

- [ ] **Step 4: Commit changes to OnboardingWizard.jsx**

Run:
```bash
git add src/components/OnboardingWizard.jsx
git commit -m "style: replace emojis with icons in OnboardingWizard.jsx"
```

---

### Task 5: Replace Emojis in Home.jsx

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Import Icon in Home.jsx**

```jsx
import Icon from '../components/Icon'
```

- [ ] **Step 2: Update home components to use Icon**

Modify rendering code:
- Welcome onboarding title (around line 107): Replace `👶 Bump Buddy` with `<Icon name="baby" size={32} className="text-primary inline mr-2" /> Bump Buddy`
- Weekly Spotlight header badge (around line 138): Replace `👶 Weekly Spotlight` with `<Icon name="baby" size={14} className="text-primary inline mr-1.5" /> Weekly Spotlight`
- Size comparison badge (around line 144): Replace `🍓 {activeWeekData.sizeComparison}` with `<span className="flex items-center gap-1.5"><Icon name="scale" size={14} className="text-secondary-content" /> {activeWeekData.sizeComparison}</span>`
- Checklist Progress header (around line 188): Replace `✅ Checklist Progress` with `<span className="flex items-center gap-1.5"><Icon name="check" size={14} className="text-accent" /> Checklist Progress</span>`
- Checklist completed message (around line 202): Replace `🎉 All checklist tasks complete!` with `<span className="flex items-center gap-1"><Icon name="confetti" size={14} className="text-accent" /> All checklist tasks complete!</span>`
- Journey Timeline header title (around line 244): Replace `📅 Journey Timeline` with `<span className="flex items-center gap-1.5"><Icon name="calendar" size={16} className="text-primary" /> Journey Timeline</span>`

- [ ] **Step 3: Commit changes to Home.jsx**

Run:
```bash
git add src/pages/Home.jsx
git commit -m "style: replace emojis with icons in Home.jsx"
```

---

### Task 6: Replace Emojis in Timeline.jsx

**Files:**
- Modify: `src/pages/Timeline.jsx`

- [ ] **Step 1: Import Icon in Timeline.jsx**

```jsx
import Icon from '../components/Icon'
```

- [ ] **Step 2: Update timeline components to use Icon**

Modify rendering code:
- Scrapbook Timeline badge (around line 51): Replace `📖 Scrapbook Timeline` with `<span className="flex items-center gap-1.5"><Icon name="book" size={12} className="text-primary" /> Scrapbook Timeline</span>`
- Center Active Week button (around line 75): Replace `📍 Center Active Week` with `<span className="flex items-center gap-1"><Icon name="mapPin" size={12} className="text-white" /> Center Active Week</span>`
- Trimester Titles (around lines 108, 111, 114): Update trimesterTitle string to remove `🌸` and instead render the icon dynamically or keep strings clean.
  Let's keep the `trimesterTitle` string clean without `🌸` and render the icon inline when rendering the badge:
  - Modify trimesterTitle strings (lines 108, 111, 114) to exclude "🌸 ".
  - In rendering section (around line 164), render `<Icon name="flower" size={14} className="text-primary shrink-0" />` (using the correct color based on trimester) inline with the title.

- [ ] **Step 3: Commit changes to Timeline.jsx**

Run:
```bash
git add src/pages/Timeline.jsx
git commit -m "style: replace emojis with icons in Timeline.jsx"
```

---

### Task 7: Replace Emojis in WeekDetails.jsx

**Files:**
- Modify: `src/pages/WeekDetails.jsx`

- [ ] **Step 1: Import Icon in WeekDetails.jsx**

```jsx
import Icon from '../components/Icon'
```

- [ ] **Step 2: Update WeekDetails components to use Icon**

Modify rendering code:
- Active Week Alert (around line 138): Replace `<span>ℹ️</span>` with `<Icon name="info" size={16} className="text-primary shrink-0" />`
- Developmental Highlights header (around line 180): Replace `✨ Developmental Highlights` with `<span className="flex items-center gap-1.5"><Icon name="sparkles" size={16} className="text-primary" /> Developmental Highlights</span>`
- Healthy Tip header (around line 194): Replace `<span>💡</span> Healthy Tip` with `<span className="flex items-center gap-1.5"><Icon name="lightbulb" size={16} className="text-primary" /> Healthy Tip</span>`
- Weekly Checklist header (around line 213): Replace `✅ Weekly Checklist` with `<span className="flex items-center gap-1.5"><Icon name="check" size={18} className="text-primary" /> Weekly Checklist</span>`

- [ ] **Step 3: Commit changes to WeekDetails.jsx**

Run:
```bash
git add src/pages/WeekDetails.jsx
git commit -m "style: replace emojis with icons in WeekDetails.jsx"
```

---

### Task 8: Verify build and correctness

**Files:**
- None

- [ ] **Step 1: Build the application**

Run: `pnpm run build`
Expected: Build passes with no compilation errors.

- [ ] **Step 2: Run dev server and inspect all pages**

Confirm all icons load correctly in the browser.
