# Developer & Agent Onboarding Guide (`agent.md`)

Welcome to **Bump Buddy**, a warm, friendly, highly utility-focused pregnancy helper web application built with React, Vite, Tailwind CSS, and DaisyUI. This guide is designed to help developer agents quickly understand the codebase, architectural choices, styling constraints, and project rules.

---

## 1. Project Overview & Scope
Bump Buddy is a privacy-first, account-free pregnancy companion app designed with a mobile-first philosophy that scales beautifully to desktop viewports.
- **Privacy First:** There are no user accounts, sign-ups, or server-side databases. All data remains local to the user's browser.
- **Key Features:**
  - Onboarding wizard that prompts for the user's start date and calculates their estimated due date (EDD) and current week.
  - Interactive week-by-week tracker (Weeks 1 to 40) detailing developmental milestones, health tips, and a customizable checkbox list of weekly to-dos.
  - A dual-column home dashboard showcasing current progress, a baby size tracker (using food/fruit analogies), and a timeline navigator.
  - Local state persistence for the start date and weekly checklists.

---

## 2. Tech Stack & Scripts

### Dependencies
Configure and manage packages inside [package.json](file:///h:/web/12-BumpBuddy/BumpBuddy/package.json):
- **Core Library:** React 18.3.1
- **Routing:** `react-router-dom` v6.23.1
- **Styling:** Tailwind CSS v3.4.4 & DaisyUI v4.12.2 (utility styling and component framework)
- **Tooling:** Vite v5.2.11
- **Testing:** Vitest v1.6.0 with `jsdom`

### Project Commands
Use these commands to interact with the environment:
- **Run dev server:** `pnpm dev` (Runs locally at `http://localhost:5173`)
- **Build application:** `pnpm build`
- **Run preview:** `pnpm preview`
- **Execute unit tests:** `pnpm test`

---

## 3. Directory Layout Tour

```
BumpBuddy/
├── .superpowers/         # Design brainstorm assets, sketches, and content files
├── docs/                 # Project documentation, designs, and feature specifications
│   └── superpowers/
│       ├── plans/        # Chronological blueprints (e.g. MVP, Loading Delay)
│       └── specs/        # Technical and UI specifications
├── src/                  # Main application source directory
│   ├── components/       # Reusable components
│   │   └── OnboardingWizard.jsx
│   ├── data/             # Static structured JSON records
│   │   └── weeks.json
│   ├── pages/            # View pages mapped to routes
│   │   ├── Home.jsx
│   │   └── WeekDetails.jsx
│   ├── utils/            # Calculation helpers and storage logic
│   │   ├── pregnancy.js
│   │   └── pregnancy.test.js
│   ├── App.jsx           # Application entry layout & routing definitions
│   ├── index.css         # Global Tailwind CSS imports
│   └── main.jsx          # React DOM render mounting point
├── index.html            # Core entry HTML document
├── tailwind.config.js    # Tailwind configuration defining custom pastel themes
└── vite.config.js        # Vite build tool and plugins configuration
```

---

## 4. Visual Identity & Styling Rules

### The Soft Pastel Trio Theme
To ensure a calming and celebratory user experience, Bump Buddy utilizes a custom-designed DaisyUI theme called `bumpbuddy` declared in [tailwind.config.js](file:///h:/web/12-BumpBuddy/BumpBuddy/tailwind.config.js):
- **Primary Lavender (`#7970c3`):** Prominent headers, active buttons, core status highlights.
- **Secondary Soft Pink (`#ffacda`):** Accents, alert boundaries, progress step backgrounds.
- **Accent Mint Green (`#a8e6cf`):** Checklist checkboxes, completed states, progress percentages.
- **Neutral Slate Gray (`#3d4451`):** Contrast body text for high readability.
- **Base Warm Off-White (`#faf8f6`):** Standard page canvas background.

### UX Design Constraints
- **Touch Target Accessibility:** All buttons, interactive selectors, and checklists must feature clickable areas of at least `48px` vertically and horizontally.
- **Checklist Inclusivity:** The entire text label associated with a checklist checkbox must be interactive, wrapping inside a standard HTML `<label>` element so clicking the text toggles the input.
- **Responsive Layout:** 
  - Mobile is the primary layout. Content is stacked cleanly.
  - On desktop viewports (using Tailwind's `lg:` prefix), pages utilize grid splits to prevent excessive text stretching:
    - [Home.jsx](file:///h:/web/12-BumpBuddy/BumpBuddy/src/pages/Home.jsx): Split into `col-span-7` (Welcome & Weekly status) and `col-span-5` (Key stats, Navigator, Reset).
    - [WeekDetails.jsx](file:///h:/web/12-BumpBuddy/BumpBuddy/src/pages/WeekDetails.jsx): Split into `lg:grid-cols-12` consisting of a left timeline sidebar (`lg:col-span-3`), a center developmental guide (`lg:col-span-5`), and a right checklist panel (`lg:col-span-4`).

---

## 5. Copywriting & Tone Guidelines
No clinical jargon or abbreviations are exposed directly to the end user. When modifying copy, adhere to the following mappings:
- **Avoid:** "LMP", "Last Menstrual Period" (as a label/body title).
- **Use:** *"When did your last period start?"*, *"First day of your last period"*.
- **Avoid:** "EDD", "Estimated Date of Delivery".
- **Use:** *"Your baby's arrival date"*, *"Estimated due date"*.
- **Avoid:** "GA", "Gestational Age".
- **Use:** *"Week X of your pregnancy journey"*.
- **Tone Choice:** Warm, supportive, uplifting, and clear. Avoid dry medical clinical phrasing.

---

## 6. Architecture & Data Model

### Static Week Records
The file [weeks.json](file:///h:/web/12-BumpBuddy/BumpBuddy/src/data/weeks.json) contains a list of objects for pregnancy weeks 1 through 40. Every entry matches the schema:
```json
{
  "weekNumber": 10,
  "sizeComparison": "Strawberry",
  "highlights": [
    "Your baby is now officially a fetus.",
    "Vital organs—like kidneys, intestines, brain, and liver—are beginning to function.",
    "Tiny fingers and toes are fully formed."
  ],
  "healthTip": "Stay hydrated and incorporate calcium-rich foods into your diet. Light stretching can ease early muscle fatigue.",
  "checklist": [
    "Schedule your next prenatal checkup",
    "Look into first-trimester screening options",
    "Stay hydrated: drink at least 8-10 glasses of water",
    "Start reading about childbirth options"
  ]
}
```

### Local Storage Schema
Bump Buddy saves user configurations on the client side:
- `bump_buddy_lmp`: Holds the Last Menstrual Period date string (e.g., `"2026-04-01"`).
- `bump_buddy_week_{weekNumber}_checklist`: Holds a JSON-serialized string of completed tasks for that specific week (e.g. `["Schedule your next prenatal checkup", "Stay hydrated"]`).

### Calculation Core (`src/utils/pregnancy.js`)
Calculations are written inside [pregnancy.js](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js) and validated with tests inside [pregnancy.test.js](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.test.js):
1. **Estimated Due Date Calculation:** [calculateArrivalDate](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js#L1-L7) adds 280 days (40 weeks) to the LMP string.
2. **Current Week Math:** [calculateCurrentWeek](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js#L9-L25) strips time components for consistent midnight-to-midnight division. Clamps outputs to a minimum of `1` and a maximum of `40`.
3. **Data Helpers:**
   - [getPersistedLMP](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js#L27-L32): Reads the LMP string.
   - [setPersistedLMP](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js#L34-L38): Saves the LMP string.
   - [clearPersistedData](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.js#L40-L48): Removes the LMP date and clears week checklists 1 through 40.

### State Synchronization
Components coordinate local storage changes using a custom global dispatch pattern. When a user completes onboarding or clears their tracking data, components trigger a `'storage'` event on the global window context:
```javascript
window.dispatchEvent(new Event('storage'))
```
This forces the root [App.jsx](file:///h:/web/12-BumpBuddy/BumpBuddy/src/App.jsx) navigation header to recalculate and display the correct active week badge or clear it immediately without page reloads.

---

## 7. Premium UX Features

### The Onboarding Calculation Delay
To provide a satisfying, premium feel that conveys a sense of tailored preparation, the onboarding flow in [OnboardingWizard.jsx](file:///h:/web/12-BumpBuddy/BumpBuddy/src/components/OnboardingWizard.jsx) runs a simulated analysis phase:
- **Delay Period:** ~4.8 - 6 seconds.
- **Visuals:** A rose-pink spinner surrounds a shifting milestone emoji.
- **Messages:** Transitions occur every 800ms through `LOADING_STEPS` state loops, fading/blurring the text out 200ms before changing the step description.

---

## 8. Development Integrity & Guidelines for Agents
1. **Maintain Tests:** Before editing core logic, review [pregnancy.test.js](file:///h:/web/12-BumpBuddy/BumpBuddy/src/utils/pregnancy.test.js). Always run `pnpm test` to ensure all changes keep tests green.
2. **DaisyUI Synergy:** Check styles and colors before introducing new custom classes. Leverage the predefined classes (`btn-primary`, `btn-secondary`, `btn-outline`, `step-secondary`, etc.) to keep layout patterns uniform.
3. **Mobile First:** Ensure that any newly introduced layout wraps smoothly inside narrow mobile screens (`max-w-md` or responsive grids). Do not create horizontal screen breaks.
4. **Browser Visual Verification:** Do not run automatic browser checks (such as browser subagents or automated browser drivers) to verify visual layout changes or browser-rendered states. Instead, ask the human developer to manually preview, interact with, and check the browser rendering.
