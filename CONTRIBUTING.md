# Contributing

Use Node 24.13+ and `npm ci`. Run `npm run check`, `npm run format:check` and native Metro exports before submitting a change.

Keep screens, UI components, SQL repositories and pure domain logic separate. Add regression tests for persistence, timer and calendar changes. Avoid hardcoded demo statistics. Include a device test description for interaction or native changes.

Do not commit local databases, credentials, signing keys or generated native build output. Keep existing Git history: use meaningful feature and fix commits. Respect the original Lumina design attribution and do not add paid assets without authorization.
