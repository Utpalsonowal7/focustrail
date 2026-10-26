import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Empty } from '../../components/Empty';
import { HabitCard } from './HabitCard';
import { HabitEditor } from './HabitEditor';
import { useData } from '../../providers/DataProvider';
import type { Habit } from '../../types/models';
export function HabitsScreen() {
  const { data } = useData();
  const [edit, setEdit] = useState<Habit | null | undefined>(),
    [archived, setArchived] = useState(false);
  const habits = data!.habits.filter((h) => !!h.archived === archived);
  return (
    <Screen
      title="Small steps. Real progress."
      subtitle="Your daily habits, one check-in at a time."
    >
      <Button label="＋ New habit" onPress={() => setEdit(null)} />
      <Button
        label={archived ? 'Show active habits' : 'Show archived habits'}
        secondary
        onPress={() => setArchived(!archived)}
      />
      {habits.length ? (
        habits.map((h) => (
          <HabitCard key={h.id} habit={h} onEdit={() => setEdit(h)} />
        ))
      ) : (
        <Empty
          title="Start with one small habit"
          detail="Read a page. Stretch. Practice a skill. Consistency starts here."
        />
      )}
      {edit !== undefined && (
        <HabitEditor
          habit={edit ?? undefined}
          onClose={() => setEdit(undefined)}
        />
      )}
    </Screen>
  );
}
