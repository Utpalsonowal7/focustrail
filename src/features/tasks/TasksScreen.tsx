import { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { Empty } from '../../components/Empty';
import { TaskCard } from './TaskCard';
import { TaskEditor } from './TaskEditor';
import { useData } from '../../providers/DataProvider';
import type { Task } from '../../types/models';
export function TasksScreen() {
  const { data } = useData();
  const [edit, setEdit] = useState<Task | null | undefined>(undefined),
    [search, setSearch] = useState(''),
    [filter, setFilter] = useState('Open');
  const tasks = data!.tasks.filter(
    (t) =>
      (filter === 'All' || (filter === 'Done' ? !!t.done : !t.done)) &&
      t.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Screen title="Your tasks" subtitle="Make room for what matters.">
      <Button label="＋ New task" onPress={() => setEdit(null)} />
      <Field label="Search tasks" value={search} onChange={setSearch} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['Open', 'Done', 'All'].map((f) => (
          <Button
            key={f}
            label={f}
            secondary={f !== filter}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>
      {tasks.length ? (
        tasks.map((t) => (
          <TaskCard key={t.id} task={t} onEdit={() => setEdit(t)} />
        ))
      ) : (
        <Empty
          title="A little breathing room"
          detail="Add a task or change your filter to get started."
        />
      )}
      {edit !== undefined && (
        <TaskEditor
          task={edit ?? undefined}
          onClose={() => setEdit(undefined)}
        />
      )}
    </Screen>
  );
}
