import  { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '../ui';
import type { Task } from '../../types';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

/**
 * Formulário para criar ou editar tarefas
 * Detecta automaticamente se está em modo de edição
 */
export function TaskForm({ onSubmit, editingTask, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  // Referência para focar no input
  const inputRef = useRef<HTMLInputElement>(null);

  // Se estiver editando, preenche o formulário
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      inputRef.current?.focus();
    }
  }, [editingTask]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('O título é obrigatório');
      inputRef.current?.focus();
      return;
    }

    // Envia os dados
    onSubmit(trimmedTitle, description.trim());

    // Limpa o formulário
    setTitle('');
    setDescription('');
    setError('');
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setError('');
    onCancelEdit?.();
  };

  const isEditing = !!editingTask;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="space-y-3">
        {/* Campo de título */}
        <Input
          ref={inputRef}
          type="text"
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(''); // Limpa erro ao digitar
          }}
          error={error}
          aria-label="Título da tarefa"
        />

        {/* Campo de descrição (opcional) */}
        <Input
          type="text"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Descrição da tarefa"
        />

        {/* Botões */}
        <div className="flex gap-2">
          <Button type="submit" fullWidth>
            {isEditing ? (
              <>Salvar alterações</>
            ) : (
              <>
                <Plus size={18} />
                Adicionar tarefa
              </>
            )}
          </Button>

          {isEditing && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              <X size={18} />
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
