// Definição do tipo Task - o coração do nosso app
export interface Task {
  id: string;           // ID único gerado pelo uuid
  title: string;        // Título da tarefa (obrigatório)
  description: string;  // Descrição (pode ser vazia)
  completed: boolean;   // Status: concluída ou não
  createdAt: number;    // Timestamp de criação (Date.now())
}

// Tipos para os filtros
export type FilterStatus = 'all' | 'pending' | 'completed';

// Props que vamos usar nos componentes
export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  initialData?: Task | null;
  onCancel?: () => void;
}
