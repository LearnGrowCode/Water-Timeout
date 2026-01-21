# Product Requirements Document — Water Reminder (Timeout)

## 1. Title

Water Timeout — Simple, delightful reminders to help users drink water throughout the day.

## 2. One-line summary

Lightweight mobile reminder that notifies users to drink water, allows quick yes/no confirmation, visualizes intake using playful bottle moods (full/half/quarter/sip), and provides a simplified past-days view.

## 3. Objectives and goals

* Increase daily hydration consistency by providing gentle, habitual reminders.
* Minimize friction: capture an intake response in a single tap (Yes / No).
* Provide a friendly visual representation of intake rather than precise volumes (user mental model: full/half/quarter/sip).
* Keep history minimal and easily scannable — no complicated charts or analytics.

## 4. Success metrics (KPIs)

* Daily active users (DAU) for the feature.
* Reply rate to notifications (Yes/No) — target >= 45% in first month of use.
* Average number of confirmed drinks per user per day (target 6+ confirmations within 3 months for engaged users).
* Retention of feature-enabled users after 30 days.

## 5. User personas

* Busy Professional (age 22–45): needs a low-friction nudge during the workday.
* Parent / Caregiver (age 30–55): wants a gentle reminder and a quick way to record water intake without distraction.
* Habit Starter (age 18–35): motivated by gamified micro-feedback (bottle moods).

## 6. User stories

* As a Busy Professional, I want a short notification and a one-tap confirmation so I can record water without opening the app.
* As a Habit Starter, I want a cute visual that changes as I log drinks so I feel rewarded.
* As a Parent, I want a simple history page to verify I kept hydrating over the last few days.

## 7. Core features (MVP)

1. **Notification-based quick update**

   * System push notification at scheduled intervals.
   * Notification body shows friendly/cute reminder text and two actionable buttons: **Yes** (I drank) and **No** (I didn't).
   * Tapping either button records the response and optionally shows a brief affirmation toast.
   * If the app is opened from the notification, show a minimal modal with the same two choices and a visual confirmation.

2. **Single-look UI (Today view)**

   * One-screen summary for current day: shows count of confirmed drinks and a visual water bottle (character/mascot) whose expression/mood changes with progress.
   * Visual units: **Full bottle**, **Half bottle**, **Quarter bottle**, **Sip** — used as selectable quick-logging buttons inside the app (not required in notification). Example mapping of incremental states to a progress bar.
   * Each tap on a visual unit logs an event and updates the bottle mood.
   * No attempt to measure millilitres — use conceptual units only.

3. **Track page (past days)**

   * Simplified list of previous days with: date, number of confirmations, and a small bottle icon representing the day’s level (e.g., 0–1 = sad/sip, 2–3 = neutral/quarter-half, 4+ = happy/full).
   * Tap a day for a lightweight modal showing timestamps for confirmations that day (optional) — keep default hidden unless user taps.

## 8. Notification copy (examples)

* Primary reminders (short):

  * "Time for a sip! Did you drink water?"
  * "Hydration break — drink a little?"
  * "Quick water check: did you drink now?"

* Confirmation replies (to show after user taps Yes):

  * "Nice! Keep it up 💧"  *(note: app should support localized / non-emoji variants)*
  * "Great — one step closer to hydrated!"

* If user taps No: gentle follow-up text shown in-app (not a push):

  * "No worries — I’ll remind you again soon."

> Implementation note: keep copy short (<= 45 characters for notification body) and localizable. Provide both a playful and a neutral copy set in the app settings.

## 9. Visual & interaction details

* **Bottle moods**: 4 mood states (Sad/Empty, Mild/Quarter, Okay/Half, Happy/Full). Each corresponds to thresholds of confirmed drinks for the day. Visual design should be cute but minimal (outline bottle with filling and a small face).
* **Quick-logging UI**: three tappable chips or icons under the bottle: Sip, Quarter, Half, Full. Tapping adds 1 confirmation and increases mood accordingly. (Primary fast path remains notification Yes/No; these icons are optional for in-app logging.)
* **Colors & accessibility**: use high contrast for icons and ensure moods are perceivable without color (face expressions, fill level) to support colorblind users.

## 10. Data model (simplified)

* `User` (id, timezone, notification_pref, morning_start, evening_end, locale)
* `HydrationEvent` (id, user_id, timestamp, unit_type) // unit_type ∈ {sip, quarter, half, full} or `notification_response` with yes/no
* `DailySummary` (user_id, date, confirmed_count, bottle_state) — derived nightly or computed on read

## 11. Settings & customization

* Allow user to set reminder frequency (e.g., every 30/45/60/90/120 minutes) and active window (start/end time).
* Option to choose tone: Playful / Neutral.
* Option to disable sounds or vibration for notifications.
* Option to receive a single summary at end of day (on/off).

## 12. Privacy & data retention

* Store only timestamps and conceptual unit types — do not store precise volumes.
* Allow users to delete hydration history for any time range.
* Keep default retention policy (e.g., 1 year) documented and surfaced in privacy settings.

## 13. Analytics & telemetry

* Track: notification_sent, notification_delivered, notification_clicked, response_yes, response_no, in_app_log.
* Aggregate daily: confirmations per user, reply rate, drop-off between delivered vs. clicked.

## 14. Edge cases & behavior

* If user is offline when tapping notification action, queue event locally and sync when online.
* Respect Do Not Disturb / system-level quiet hours — allow users to override only if explicitly permitted.
* If user repeatedly taps No, offer a gentle settings suggestion: reduce frequency or change active window.

## 15. Accessibility

* All notifications must include meaningful content for screen readers.
* In-app actions should be keyboard and assistive-touch accessible.
* Bottle mood changes must not be the only cue — include text and ARIA labels.

## 16. Technical considerations

* Use platform-native actionable notifications for optimal reliability (iOS UNNotificationAction, Android Notification Action Buttons).
* Keep server-side minimal: scheduling metadata, event ingestion, and lightweight aggregation. Local schedule enforcement preferred to avoid server latency.
* If push provider is used, ensure retry/delivery monitoring and follow platform best practices.

## 17. Acceptance criteria (MVP)

* Users receive scheduled notifications within their configured window and frequency.
* Notification contains two action buttons — Yes and No — which record events when tapped without opening the app.
* Today view displays an updating bottle with mood change as the user confirms drinks.
* Track page lists the last 14 days with summarized bottle icons.
* Settings allow frequency and active window customization.

## 18. Roadmap & scope

* **MVP (v1)**: Notification quick-reply (Yes/No), Today view with bottle moods, 14-day track page, basic settings.
* **v1.1**: In-app quick-log buttons (sip/quarter/half/full), playful/neutral copy packs, localized strings.
* **v2**: Social / streaks / shareable badges (optional), gentle gamification, adaptive reminders based on behavior.

## 19. Open questions (to resolve prior to dev)

* Should each notification Yes map to a single confirmation unit only, or allow the notification to pass an inferred unit (e.g., Yes = sip by default)? Recommendation: `Yes` = one confirmation; allow richer logging inside app.
* How long should the active window default be? Recommendation: 8:00–20:00 local time.
* Retention period for history and privacy defaults.

## 20. Deliverables for engineering & design

* Notification design (actions + copy variants)
* Vector assets for bottle moods (4 states) and quick-log icons
* API definition for `HydrationEvent` ingestion
* QA test plan covering notification actions, offline behavior, and accessibility


