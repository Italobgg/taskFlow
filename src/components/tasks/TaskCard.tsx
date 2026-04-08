import { Check, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Card individual de tarefa
 * Exibe título, descrição e ações
 */
export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  // Formata a data de criação
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(task.createdAt));

  return (
    <div
      className={`
        group flex items-start gap-3 p-4 rounded-xl border
        transition-all duration-200
        ${task.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
        }
      `}
    >
      {/* Checkbox customizado */}
      <button
        onClick={() => onToggle(task.id)}
        className={`
          flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2
          flex items-center justify-center
          transition-all duration-200
          ${task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }
        `}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {task.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
            font-medium leading-tight
            ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}
          `}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`
              mt-1 text-sm leading-relaxed
              ${task.completed ? 'text-gray-400' : 'text-gray-500'}
            `}
          >
            {task.description}
          </p>
        )}

        <span className="mt-2 inline-block text-xs text-gray-400">
          {formattedDate}
        </span>
      </div>

      {/* Ações - aparecem no hover */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          aria-label="Editar tarefa"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Excluir tarefa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
