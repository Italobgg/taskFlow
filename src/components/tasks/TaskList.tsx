import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import type { Task, FilterStatus } from '../../types';

interface TaskListProps {
  tasks: Task[];
  filter: FilterStatus;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Lista de tarefas ou estado vazio
 */
export function TaskList({ tasks, filter, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
