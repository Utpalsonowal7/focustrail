# Architecture

## Data flow

Native screen → DataProvider mutation guard → repository → SQLite → fresh snapshot → rendered screen.

Each feature owns its UI. Shared components contain no SQL. Pure date, timer and analytics functions are independent of React Native. Database modules accept a database instance, enabling integration tests without a simulator.

## Database lifecycle

SQLiteProvider initializes the database before rendering consumers. Migration 1 runs atomically and updates `PRAGMA user_version`. A newer unsupported version is rejected instead of silently downgrading. Foreign keys and WAL are enabled for the connection. Add new numbered migrations for future schema changes; never alter migration 1 in a released app.

## Timers

The singleton timer row is separate from completed sessions. An insert fails if another session already exists. Deadline timestamps survive process death; paused timers retain a remaining-seconds value. Completion inserts a unique session and removes the timer atomically. Break completion only removes the timer. The foreground listener and screen clock both reconcile elapsed deadlines safely. The navigation shell also reconciles every ten seconds while mounted.

The OS may suspend JavaScript in the background. No background execution is promised: elapsed timers are reconciled on return. Manually changing the system clock can affect elapsed-time interpretation. Dates follow the device timezone at recording time.

## Mutations and errors

The provider serializes UI mutations with a ref lock and exposes busy state. A failed operation surfaces its message; data is not intentionally cleared. Startup errors are contained by an error boundary. Repositories validate form inputs and use bound SQL parameters. Core relational constraints remain in SQLite.

## Extending

Add a feature under `src/features`, put persistence in `src/db`, and derive display metrics in pure modules. For backups, add a validated versioned import format and transactional restore before claiming restore support. For larger datasets, replace full snapshots with paginated queries and virtualized lists.
