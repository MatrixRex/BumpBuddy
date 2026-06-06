# Design Spec: Bump Buddy MVP

A warm, friendly, highly utility-focused pregnancy helper web application built with React, Tailwind CSS, and DaisyUI. This app is designed with a mobile-first philosophy and runs completely login-free, persisting user state locally.

---

## 1. Visual & Style System (Theme C: Soft Pastel Trio)
To create a warm, comforting, and celebratory experience for expecting parents, the application uses a custom DaisyUI theme based on soft pastels.

*   **Primary Brand Color (Lavender):** `#7970c3` (Used for headers, main UI cards, and primary buttons)
*   **Secondary/Highlight Color (Soft Pink):** `#ffacda` (Used for accents, highlight borders, and secondary buttons)
*   **Accent/Success Color (Mint Green):** `#a8e6cf` (Used for checklists, completion badges, and success status indicators)
*   **Neutral (Slate Gray):** `#3d4451` (Used for body text to ensure high contrast and readability)
*   **Base (Warm Off-White):** `#faf8f6` (Used as the page background to avoid harsh white screens)

### Tailwind Configuration (`tailwind.config.js`)
```javascript
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

---

## 2. Copywriting & Tone Guidelines
No clinical jargon or acronyms (like LMP, EDD, GA) are exposed to the user. The tone is encouraging, supportive, and accessible.

*   **LMP (Last Menstrual Period):** Described as **"The first day of your last period"** or **"When did your last period start?"**
*   **EDD (Estimated Due Date):** Described as **"Your baby's arrival date"** or **"Estimated due date"**.
*   **Calculation CTAs:** Warm prompts like **"Find my due date ✨"** or **"Let's get started!"**
*   **General Tone:** Celebratory and positive (e.g. *"Congratulations! Your little one is growing."*).

---

## 3. Onboarding Flow (First-Time Experience)
When a user loads the app without a saved session, they walk through a step-by-step wizard to set up their pregnancy tracking:

*   **Step 1: Welcome & Warm Introduction**
    *   Brief overview of what Bump Buddy does (size tracking, milestones, custom checklists).
    *   No login, accounts, or emails required.
*   **Step 2: Start Date Entry**
    *   A warm form asking: *"When did your last period start?"*
    *   Clear calendar/date picker input.
*   **Step 3: Setup Completed Summary**
    *   Instantly calculates and displays the estimated due date and current week.
    *   Includes a primary CTA: **"Let's Go! ➔"** that saves their details and takes them to their active week.

---

## 4. Persistent Dashboard & Routing
Once onboarding is complete, their information is stored in `localStorage` under `bump_buddy_lmp`.

### Home Screen (`/`)
*   **Returning Users:** Checks for the saved start date. If present, it skips onboarding and displays their personal dashboard showing:
    *   **Active Week Summary Card:**
        *   Displays the active week number (e.g., "Week 10").
        *   Displays the active week's baby size comparison (e.g., *"Your baby is the size of a Strawberry! 🍓"*).
        *   Displays a short preview summary of the week's highlights.
    *   Calculated arrival date.
    *   A prominent CTA button: **"See details & checklist for this week ➔"** linking to `/week/:weekNumber`.
    *   A **"Reset Tracker / Clear Data"** button to allow users to reset all stored information.
*   **New Users:** Displays the Onboarding wizard.

### Weekly Engine (`/week/:weekNumber`)
*   Loads information for `weekNumber` (1 through 40).
*   **Size Card:** Friendly food-based comparison (e.g., *"Your baby is the size of a Strawberry!"*).
*   **Milestone Highlights:** 2–3 key developmental highlights in bullet points.
*   **Health Tip:** A soft pink bordered tip box with exercise/nutritional advice.
*   **Interactive Checklist:** DaisyUI checkboxes connected to `localStorage` under `bump_buddy_week_{weekNumber}_checklist`.
*   **Contextual Banner:** If the viewed week is not the user's current week, show a helpful alert: *"You are viewing Week X. Go back to your active week (Week Y)."*

---

## 5. Mobile-First Layout & Touch Guidelines
Designed specifically for mobile viewports while remaining responsive on desktop screens:
*   **Touch Targets:** All interactive elements (checkboxes, buttons, inputs) will be at least `48px` tall or wide to make tap targets easy on mobile.
*   **Padding & Containers:** Maximum container width of `md` (`448px`) or `lg` (`640px`) centered on desktop screens, with generous padding on mobile (`px-4`).
*   **Checkbox Labels:** Checking the text label itself will toggle the checkbox (standard HTML `<label>` wrapper).
*   **Safe Scrolling:** Layouts will prevent horizontal overflow.

---

## 6. Technical Specifications & Stack
*   **Scaffold:** Vite + React + Tailwind CSS + DaisyUI
*   **Routing:** `react-router-dom` (v6)
*   **State Management:** React local hooks (`useState`, `useEffect`) and native `localStorage` for complete client-side persistence.
*   **JSON Data Structure:** `src/data/weeks.json` containing 40 week objects:
    *   `weekNumber` (Integer)
    *   `sizeComparison` (String)
    *   `highlights` (Array of Strings)
    *   `healthTip` (String)
    *   `checklist` (Array of Strings)
