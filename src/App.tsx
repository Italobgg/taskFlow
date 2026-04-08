import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { TaskForm, TaskList, TaskFilters } from './components/tasks';
import type { Task } from './types';

/**
 * Componente principal do TaskFlow
 */
function App() {
  // Hook que gerencia todas as tarefas
  const {
    tasks,
    filter,
    counts,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
  } = useTasks();

  // Estado para controlar edição
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handler para adicionar ou editar tarefa
  const handleSubmit = (title: string, description: string) => {
    if (editingTask) {
      // Modo edição
      updateTask(editingTask.id, { title, description });
      setEditingTask(null);
    } else {
      // Modo criação
      addTask(title, description);
    }
  };

  // Handler para excluir com confirmação
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Container principal */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
          <p className="mt-2 text-gray-500">
            Organize suas tarefas de forma simples e eficiente
          </p>
        </header>

        {/* Formulário */}
        <section className="mb-6">
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </section>

        {/* Filtros - só mostra se tiver tarefas */}
        {counts.total > 0 && (
          <section className="mb-4">
            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />
          </section>
        )}

        {/* Lista de Tarefas */}
        <section>
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggle={toggleTask}
            onEdit={setEditingTask}
            onDelete={handleDelete}
          />
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>
            Feito com 💙 por{' '}
            <a
              href="https://github.com/seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              Seu Nome
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
