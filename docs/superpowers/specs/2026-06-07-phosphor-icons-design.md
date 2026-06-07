# Design Document: Cozy Iconography with Phosphor Icons

## Goal
Replace the temporary emojis in the Bump Buddy pregnancy tracker with proper, cohesive icons from the Phosphor Icons library to elevate the design aesthetic and make it feel more cozy and premium.

## Design Decisions
1. **Centralized Icon Registry**: Rather than importing Phosphor Icons scattered throughout the components, we will create a central `Icon` component. This component accepts a friendly string name, standard size, weight, and Tailwind classes.
2. **Cozy Style Weights**:
   - Status, notifications, action badges, and main logos use the `fill` weight (e.g., `Baby`, `Lock`, `Warning`, `Lightbulb`).
   - Structural dividers, timelines, calculators, and calendars use the `regular` weight (e.g., `CalendarHeart`, `Calculator`, `BookOpen`).

## Proposed Interface mapping
| Emoji / Usage | Friendly Key | Phosphor Icon | Weight |
| --- | --- | --- | --- |
| 👶 Bump Buddy Logo | `"baby"` | `Baby` | `fill` |
| 📅 Calendar / Due Date | `"calendar"` | `CalendarHeart` | `regular` |
| 🧮 Calculator | `"calculator"` | `Calculator` | `regular` |
| ⏳ Hourglass | `"hourglass"` | `Hourglass` | `regular` |
| 🍓 Baby size comparison badge | `"scale"` | `Scale` | `regular` |
| 📋 Clipboard | `"clipboard"` | `ClipboardText` | `regular` |
| ✨ Sparkles / Highlights | `"sparkles"` | `Sparkles` | `fill` |
| 🌸 Trimester indicator / decoration | `"flower"` | `Flower` | `fill` |
| 📖 Book / Scrapbook | `"book"` | `BookOpen` | `regular` |
| 📍 Location Pin | `"mapPin"` | `MapPin` | `regular` |
| ℹ️ Information notice | `"info"` | `Info` | `fill` |
| ✅ Checklist Progress | `"check"` | `CheckCircle` | `fill` |
| 🎉 Checklist Complete | `"confetti"` | `Confetti` | `fill` |
| 🔒 Private Data Lock | `"lock"` | `Lock` | `fill` |
| ⚠️ Warning / Reset Warning | `"warning"` | `Warning` | `fill` |
| 💡 Healthy Tip Lightbulb | `"lightbulb"` | `Lightbulb` | `fill` |

## Affected Files
1. [NEW] `src/components/Icon.jsx`
2. `src/App.jsx`
3. `src/components/OnboardingWizard.jsx`
4. `src/pages/Home.jsx`
5. `src/pages/Timeline.jsx`
6. `src/pages/WeekDetails.jsx`

## Verification Plan
1. Ensure the app builds and runs successfully (`pnpm run build` & `pnpm dev`).
2. Verify all icons render properly in the browser at appropriate sizes and weights.
