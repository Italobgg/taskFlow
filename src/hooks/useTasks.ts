import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { Task, FilterStatus } from '../types';

/**
 * Hook que gerencia todo o estado e operações das tarefas
 * 
 * Responsabilidades:
 * - CRUD de tarefas (Create, Read, Update, Delete)
 * - Filtros por status
 * - Contagem de tarefas
 * - Persistência automática no localStorage
 */
export function useTasks() {
  // Estado das tarefas - persiste no localStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', []);
  
  // Estado do filtro atual
  const [filter, setFilter] = useLocalStorage<FilterStatus>('taskflow-filter', 'all');

  // ============================================
  // OPERAÇÕES CRUD
  // ============================================

  /**
   * Adiciona uma nova tarefa
   * useCallback evita recriação desnecessária da função
   */
  const addTask = useCallback((title: string, description: string = '') => {
    const newTask: Task = {
      id: uuidv4(),                    // Gera ID único
      title: title.trim(),             // Remove espaços extras
      description: description.trim(),
      completed: false,                // Sempre começa como pendente
      createdAt: Date.now(),           // Timestamp atual
    };

    // Adiciona no início da lista (mais recente primeiro)
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, [setTasks]);

  /**
   * Atualiza uma tarefa existente
   */
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, ...updates } // Mescla as atualizações
          : task                     // Mantém as outras intactas
      )
    );
  }, [setTasks]);

  /**
   * Remove uma tarefa
   */
  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  /**
   * Alterna o status completed de uma tarefa
   */
  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, [setTasks]);

  // ============================================
  // DADOS DERIVADOS (calculados a partir do estado)
  // ============================================

  /**
   * Lista de tarefas filtrada pelo status selecionado
   * useMemo evita recalcular em toda renderização
   */
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  /**
   * Contadores para exibir estatísticas
   */
  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  }), [tasks]);

  // Retorna tudo que os componentes vão precisar
  return {
    // Estado
    tasks: filteredTasks,
    filter,
    counts,
    
    // Ações
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
  };
}
