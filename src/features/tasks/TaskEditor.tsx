import { useState } from 'react';
import { randomUUID } from 'expo-crypto';
import type { Task } from '../../types/models';
import { Sheet } from '../../components/Sheet';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { useData } from '../../providers/DataProvider';
import { saveTask } from '../../db/tasks';
export function TaskEditor({
  task,
  onClose,
}: {
  task?: Task;
  onClose: () => void;
}) {
  const { run, busy, error } = useData();
  const [name, setName] = useState(task?.title ?? ''),
    [notes, setNotes] = useState(task?.notes ?? ''),
    [due, setDue] = useState(task?.due ?? ''),
    [priority, setPriority] = useState<Task['priority']>(
      task?.priority ?? 'medium',
    );
  return (
    <Sheet title={task ? 'Edit task' : 'New task'} onClose={onClose}>
      <Field label="Task title" value={name} onChange={setName} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
      <Field
        label="Due date (YYYY-MM-DD, optional)"
        value={due}
        onChange={setDue}
      />
      {(['low', 'medium', 'high'] as const).map((p) => (
        <Button
          key={p}
          label={`${p === priority ? '✓ ' : ''}${p} priority`}
          secondary={p !== priority}
          onPress={() => setPriority(p)}
        />
      ))}
      {error && <Text>{error}</Text>}
      <Button
        label="Save task"
        disabled={busy}
        onPress={() => {
          void run((db) =>
            saveTask(db, {
              id: task?.id ?? randomUUID(),
              title: name,
              notes,
              priority,
              due,
              done: task?.done ?? 0,
              completed_on: task?.completed_on ?? null,
              created_at: task?.created_at ?? Date.now(),
            }),
          ).then((ok) => {
            if (ok) onClose();
          });
        }}
      />
    </Sheet>
  );
}
