# Design Specification: Calculated Due Date Loading Animation & Step Tracker Coloring

This document details the design and implementation specifications for adding a premium, animated loading sequence when calculating the Estimated Due Date (EDD) in the Bump Buddy onboarding wizard, and styling the DaisyUI step tracker component to match.

## Overview & Goal
To make the application feel more interactive and "intelligent", we will introduce a fake calculation delay of approximately 4.5–5 seconds after the user enters their Last Menstrual Period (LMP). During this delay, a rotating rose-colored pregnancy wheel spinner will be displayed along with a sequence of status updates and emoji icons transitioning with smooth blur and fade animations.

In addition, the current DaisyUI progress steps tracker's colors will be updated to use the theme's secondary (Cozy Blush / pink) color for active steps to align with the loader's aesthetic.

---

## User Interface & Style Details

### 1. DaisyUI Steps Tracker Coloring
We will keep the DaisyUI progress steps tracker but modify its active states to use the theme's secondary color:
- Replace `step-primary` with `step-secondary` on completed/active steps:
  ```html
  <ul className="steps steps-horizontal w-full mb-8 text-xs font-semibold">
    <li className={`step ${step >= 1 ? 'step-secondary' : ''}`}>Welcome</li>
    <li className={`step ${step >= 2 ? 'step-secondary' : ''}`}>Your Info</li>
    <li className={`step ${step >= 3 ? 'step-secondary' : ''}`}>Summary</li>
  </ul>
  ```
- This will color active circles and progress lines in **Cozy Blush (#ebb0c9)** rather than lavender.

### 2. Sleek Rose Wheel Spinner
A circular spinning animation positioned in the center of the loading view:
- **Outer Track**: `border: 6px solid #fce7f3` (soft rose tint)
- **Active Spinning Segment**: `border-top: 6px solid #f472b6` (vibrant pink/rose)
- **Animation**: Smooth infinite rotation over 1.2 seconds (`animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`).
- **Inner Icon**: A baby emoticon emoji (`👶`) placed in the center, pulsing slightly via CSS scale transition.

### 3. Transitioning Calculations & Emoji Icons
A series of steps will be animated sequentially inside the loader:
1. 📅 "Analyzing your Last Menstrual Period..."
2. 🧮 "Applying Naegele's Rule for calculation..."
3. ⏳ "Determining Estimated Due Date (EDD)..."
4. 🍓 "Tailoring weekly baby growth comparisons..."
5. 📋 "Configuring customized checklist templates..."
6. ✨ "Almost ready! Preparing dashboard..."

Each step will transition to the next at **900ms** intervals:
- **Transition Properties**: `opacity` (0 to 1), `filter` (`blur(4px)` to `blur(0)`), and `transform` (`scale(0.95)` to `scale(1)`).
- **Transition Duration**: `300ms` exit and entry.

---

## Technical Architecture

### 1. Wizard State Machine
In `src/components/OnboardingWizard.jsx`, we will introduce a new state flag or insert an intermediate stage in the `step` flow:
- `step === 1` - Welcome
- `step === 2` - Your Info
- `step === 'loading'` - Loading animation
- `step === 3` - Summary

### 2. Loading State Implementation
When clicking "Calculate Due Date" on Step 2:
1. Instead of immediately calling `setStep(3)`, we set `step` to `'loading'`.
2. A React `useEffect` hook will handle the interval timers for the status updates:
   - Maintains a `currentStepIndex` state (0 to 5).
   - Updates `currentStepIndex` every `900ms`.
   - Before each update, toggles a CSS visibility class (`hidden`) to trigger the exit fade/blur transition.
   - At the end of the final loading step (after ~5.4 seconds), transitions the main wizard step to `3` (Summary).

### 3. Verification Plan
- **Component verification**: Run `pnpm dev` locally to check for build errors and inspect transitions.
- **State checks**: Ensure that the final selection is persisted to local storage correctly when onboarding is completed.
