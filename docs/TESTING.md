# Validation and device checklist

Automated: `npm run check` and `npx expo export --platform android --platform ios`.

The integration suite executes real SQLite SQL via Node 24, not an in-memory JavaScript imitation. It does not exercise Expo's native bridge. Metro export verifies bundle compilation, not device execution.

Before release, test on both Android and iOS:

- Fresh install: startup succeeds, empty states display and no invented progress appears.
- Add a task with apostrophes; edit it; complete and reopen it; search and filter it.
- Reject a blank title and an invalid date. Verify keyboard scrolling and Android back behavior.
- Set a one-minute focus duration, start a linked session, pause, restart the app, and resume.
- Background/terminate a running session. Reopen after expiry: exactly one history record appears.
- Finish a break: focus totals do not increase. Discard a session after confirming.
- Delete a task with past sessions: history remains.
- Check a habit twice: the second tap undoes today's check-in. Archive and restore without losing history.
- Leave the app open across midnight; verify new daily check-ins use the new local date.
- Change preferences, restart, and verify persistence.
- Export via the native share sheet and inspect the resulting JSON. Do not expect restore support.
- Test large text, screen readers, narrow devices, safe areas and error recovery.

Device checks above are pending; no physical-device validation is claimed.
