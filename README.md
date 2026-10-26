<div align="center">

# FocusTrail

### Small steps. Real progress.

An offline productivity companion built with **React Native + Expo + TypeScript**, with **SQLite on your device**.

Plan your work. Build daily habits. Make time for focus.

![Expo](https://img.shields.io/badge/Expo-SDK_58-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local_storage-003B57?logo=sqlite&logoColor=white)

</div>

## What you can do

| Screen      | Features                                                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Today**   | Daily focus ring, goal progress, task totals, habit check-ins, quick navigation                                            |
| **Tasks**   | Create and edit tasks, notes, priorities, optional due dates, search, open/done filters, completion and confirmed deletion |
| **Habits**  | Daily check-ins, seven-day history, current streaks, rename, archive and restore                                           |
| **Focus**   | Focus and break sessions, optional task association, pause/resume, persistent deadlines and discard confirmation           |
| **Summary** | Seven-day focus chart, daily task completions and recent session history                                                   |
| **Profile** | Name, session lengths, daily goal and JSON export through the native share sheet                                           |

No account, API key or backend is required. No seeded statistics: the dashboard reflects your own activity.

## Run locally

Use **Node.js 24.13 or later**, npm, and a device or emulator compatible with Expo SDK 58.

```bash
git clone https://github.com/Utpalsonowal7/focustrail.git
cd focustrail
npm ci
npx expo start
```

Open the QR code with a compatible Expo Go app. Press **a** for a configured Android emulator or **i** for the iOS simulator on macOS. For a native development build:

```bash
npx expo run:android
# macOS + Xcode required:
npx expo run:ios
```

Android Studio/Android SDK are required for local Android builds. Windows supports Android development; the iOS simulator requires macOS. If Expo Go reports an SDK mismatch, use a compatible Expo Go version or build the app locally. No paid Expo service is required for local development.

The supported targets are **Android and iOS**. A browser implementation is not included.

## First five minutes

1. Open **Profile** and set your name, focus duration, break duration and daily goal.
2. Add a task in **Tasks**, optionally with a due date in `YYYY-MM-DD` format.
3. Add a daily habit and check it off in **Habits**.
4. Start a session in **Focus**. You can associate it with an open task.
5. Complete the session and check **Summary** for your real progress.

## Modular architecture

| Directory                                | Responsibility                                             |
| ---------------------------------------- | ---------------------------------------------------------- |
| `src/db/`                                | Schema, migrations and parameterized SQL repositories      |
| `src/features/home/`                     | Daily dashboard                                            |
| `src/features/tasks/`                    | Task screens, cards and editor                             |
| `src/features/habits/`                   | Habit screens, cards and editor                            |
| `src/features/focus/`                    | Focus timer screen                                         |
| `src/features/insights/`                 | Analytics calculations and summary screen                  |
| `src/features/settings/`                 | Preferences and export                                     |
| `src/components/`                        | Reusable cards, fields, buttons, sheets and charts         |
| `src/providers/`                         | Data loading, serialized mutations and foreground recovery |
| `src/navigation/`                        | Tab navigation and Android back behavior                   |
| `src/theme/`                             | Shared design tokens                                       |
| `src/types/`, `src/utils/`, `src/hooks/` | Domain contracts, pure logic and lifecycle hooks           |
| `tests/`                                 | Domain tests and actual SQLite integration tests           |

`App.tsx` composes providers. Screens call repositories through `DataProvider`; SQL is kept out of presentation components. See [architecture notes](docs/ARCHITECTURE.md).

## How local storage works

`expo-sqlite` opens `focustrail.db` in the app sandbox. Versioned migrations enable WAL mode and foreign keys. Tables store tasks, habits, daily check-ins, completed sessions, one active timer, and preferences.

- SQL values use bound parameters.
- A unique `(habit_id, day)` key prevents duplicate daily check-ins.
- Deleting a task preserves its sessions with a null task reference.
- Archiving a habit preserves all its check-ins.
- Completion recording and timer deletion happen together in a transaction.
- A session ID is unique, preventing double counting on repeated recovery.

Data persists across normal app restarts. Uninstalling the app or clearing its data removes local storage. JSON export shares a readable data snapshot; **import/restore is not implemented**. The database is not encrypted by this application.

## Timer and metric definitions

A running timer stores a deadline rather than counting interval callbacks. Returning from the background recomputes remaining time. Pausing stores remaining seconds; resuming creates a new deadline. Restarting the app recovers the saved timer.

Only **completed focus sessions** count toward focus totals. Breaks and discarded sessions do not. A session that expires while the app is closed is recorded on return, using its deadline's local calendar day. This tracks elapsed scheduled focus time, not verified attention. There is no background alarm or push notification.

Habit streaks use consecutive local calendar dates, including yesterday if today has not yet been checked. Daily tasks count currently completed tasks whose completion date is today. Reopening a task removes that completion from the count. The weekly chart shows the last seven calendar days.

## Design reference

The interface adapts the **free Home and Summary samples** from [Lumina UI Kit 1.1](https://www.figma.com/design/gYKWDqWNkgKeErMcrFzOnQ/?node-id=570-67044), by **Samson Oluwajunse**. Reference nodes: `2202:24035` and `2202:24222` on the “🔥(Free) Designs” page.

The near-black surfaces, purple accents, circular time display and summary-card hierarchy follow those samples. Task, habit and settings workflows are native adaptations for FocusTrail. Paid screens and paid assets were not purchased or used.

**Fidelity limitation:** Figma's asset downloads returned HTML in the build environment. The decorative textures, original icon assets and avatar were not copied; the app uses native components and bundled icons. It is an adapted implementation, not an exact reproduction. Original design rights remain with its creator; this repository does not grant a license to the full UI kit.

## Development checks

```bash
npm run check           # TypeScript, Expo ESLint, 11 tests
npm run format:check    # Formatting
npx expo export --platform android --platform ios
```

Tests run the repository SQL against Node's real SQLite engine with a small adapter for Expo's async API. They cover migration repeatability, completion preservation, foreign keys, habit toggling, timer singleton enforcement, idempotent completion, pause behavior, break exclusion, settings validation, calendar arithmetic and streaks. They do not emulate the Expo SQLite native bridge.

**Verified during implementation:** strict type checking, lint, 11 tests, Android and iOS Metro bundle exports. **Not yet verified:** installation and interaction on a physical device/simulator, native share behavior and visual fidelity on device. See the [device checklist](docs/TESTING.md).

## Current scope

This first version includes offline tasks, daily habits, a durable focus timer and local analytics. Cloud sync, reminder notifications, backup restore, custom habit schedules, app-blocking/screen-time monitoring, light theme and store releases are future work. All records are loaded into memory for a personal-use dataset; pagination is a future improvement for very large histories.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), keep feature code modular, and add meaningful tests when changing persistence or timer behavior. No application code license has been selected yet.
