import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { randomUUID } from 'expo-crypto';
import { useData } from '../../providers/DataProvider';
import { useClock } from '../../hooks/useClock';
import { remaining } from '../../utils/timer';
import { clock } from '../../utils/dates';
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  discardTimer,
  finishTimer,
} from '../../db/timer';
import { Screen } from '../../components/Screen';
import { Ring } from '../../components/Ring';
import { Button } from '../../components/Button';
import { Muted } from '../../components/Text';
export function FocusScreen() {
  const { data, run, busy } = useData();
  const now = useClock();
  const [kind, setKind] = useState<'focus' | 'break'>('focus'),
    [taskId, setTask] = useState<string | null>(null);
  const t = data!.timer,
    seconds = t
      ? remaining(t, now)
      : (kind === 'focus' ? data!.settings.focus : data!.settings.rest) * 60;
  useEffect(() => {
    if (t?.deadline && seconds === 0) void run(finishTimer);
  }, [t, seconds, run]);
  return (
    <Screen title="Find your flow" subtitle="One thing at a time is enough.">
      <Ring
        value={clock(seconds)}
        label={t?.kind ?? kind}
        progress={t ? 1 - seconds / t.duration : 0}
        caption={
          t
            ? t.deadline
              ? 'Session in progress'
              : 'Paused'
            : 'Ready when you are'
        }
      />
      {t ? (
        <>
          <Button
            disabled={busy}
            label={t.deadline ? 'Pause session' : 'Resume session'}
            onPress={() =>
              void run((db) =>
                t.deadline ? pauseTimer(db, t) : resumeTimer(db, t),
              )
            }
          />
          <Button
            label="Discard session"
            secondary
            disabled={busy}
            onPress={() =>
              Alert.alert(
                'Discard this session?',
                'This unfinished time will not be added to your history.',
                [
                  { text: 'Keep going', style: 'cancel' },
                  {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => void run(discardTimer),
                  },
                ],
              )
            }
          />
        </>
      ) : (
        <>
          <Button
            label={`Start ${kind}`}
            disabled={busy}
            onPress={() =>
              void run((db) =>
                startTimer(
                  db,
                  randomUUID(),
                  seconds,
                  kind,
                  data!.tasks.some((x) => x.id === taskId) ? taskId : null,
                ),
              )
            }
          />
          <Button
            label={kind === 'focus' ? 'Switch to break' : 'Switch to focus'}
            secondary
            onPress={() => setKind(kind === 'focus' ? 'break' : 'focus')}
          />
          <Muted>Link a task (optional)</Muted>
          <Button
            label={taskId === null ? '✓ Free focus' : 'Free focus'}
            secondary
            onPress={() => setTask(null)}
          />
          {data!.tasks
            .filter((x) => !x.done)
            .map((x) => (
              <Button
                key={x.id}
                label={`${taskId === x.id ? '✓ ' : ''}${x.title}`}
                secondary={taskId !== x.id}
                onPress={() => setTask(x.id)}
              />
            ))}
        </>
      )}
      <Muted>
        Time continues while the app is closed. Completed sessions are saved
        when you return. No background alarm is scheduled.
      </Muted>
    </Screen>
  );
}
