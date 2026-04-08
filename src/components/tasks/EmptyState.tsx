import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import type { FilterStatus } from '../../types';

interface EmptyStateProps {
  filter: FilterStatus;
}

/**
 * Estado vazio - mostra mensagens diferentes por filtro
 */
export function EmptyState({ filter }: EmptyStateProps) {
  const content = {
    all: {
      icon: ClipboardList,
      title: 'Nenhuma tarefa ainda',
      description: 'Comece adicionando sua primeira tarefa usando o formulário acima.',
    },
    pending: {
      icon: CheckCircle2,
      title: 'Tudo em dia!',
      description: 'Você não tem tarefas pendentes. Que tal adicionar uma nova?',
    },
    completed: {
      icon: Clock,
      title: 'Nenhuma tarefa concluída',
      description: 'Conclua algumas tarefas para vê-las aqui.',
    },
  };

  const { icon: Icon, title, description } = content[filter];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm">{description}</p>
    </div>
  );
}
