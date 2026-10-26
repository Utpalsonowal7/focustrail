import { useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { Sheet } from '../../components/Sheet';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { useData } from '../../providers/DataProvider';
import { saveHabit } from '../../db/habits';
import type { Habit } from '../../types/models';
export function HabitEditor({
  habit,
  onClose,
}: {
  habit?: Habit;
  onClose: () => void;
}) {
  const [name, setName] = useState(habit?.title ?? '');
  const { run, busy, error } = useData();
  return (
    <Sheet
      title={habit ? 'Edit habit' : 'Build a daily habit'}
      onClose={onClose}
    >
      <Field label="Habit name" value={name} onChange={setName} />
      {error && <Text>{error}</Text>}
      <Button
        label="Save habit"
        disabled={busy}
        onPress={() =>
          void run((db) => saveHabit(db, habit?.id ?? randomUUID(), name)).then(
            (ok) => {
              if (ok) onClose();
            },
          )
        }
      />
    </Sheet>
  );
}
