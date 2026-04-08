import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskCard } from '../TaskCard'
import type { Task } from '../../../types'

// ========== Mocks e Factories ==========

/**
 * Factory para criar tasks de teste
 * createdAt usa timestamp (number) conforme o tipo Task
 */
const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Tarefa de teste',
  description: 'Descrição da tarefa',
  completed: false,
  createdAt: new Date('2024-03-15T12:00:00').getTime(),
  ...overrides,
})

// Funções mock para os callbacks
const createMockHandlers = () => ({
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
})

describe('TaskCard', () => {
  // ========== Renderização ==========
  describe('Renderização', () => {
    it('deve renderizar o título da tarefa', () => {
      const task = createMockTask({ title: 'Minha tarefa' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByText('Minha tarefa')).toBeInTheDocument()
    })

    it('deve renderizar a descrição quando fornecida', () => {
      const task = createMockTask({ description: 'Descrição detalhada' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByText('Descrição detalhada')).toBeInTheDocument()
    })

    it('não deve renderizar descrição quando não fornecida', () => {
      const task = createMockTask({ description: undefined })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.queryByText('Descrição da tarefa')).not.toBeInTheDocument()
    })

    it('deve renderizar a data formatada em pt-BR', () => {
      // Usa uma data fixa e calcula o resultado esperado
      const testDate = new Date('2024-03-15T12:00:00')
      const task = createMockTask({ createdAt: testDate.getTime() })
      const handlers = createMockHandlers()

      // Calcula o formato esperado usando a mesma lógica do componente
      const expectedDate = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(testDate)

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByText(expectedDate)).toBeInTheDocument()
    })

    it('deve renderizar os botões de ação', () => {
      const task = createMockTask()
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByLabelText('Editar tarefa')).toBeInTheDocument()
      expect(screen.getByLabelText('Excluir tarefa')).toBeInTheDocument()
    })
  })

  // ========== Estado de Conclusão ==========
  describe('Estado de conclusão', () => {
    it('deve exibir checkbox marcado quando concluída', () => {
      const task = createMockTask({ completed: true })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      const toggleButton = screen.getByLabelText('Marcar como pendente')
      expect(toggleButton).toBeInTheDocument()
    })

    it('deve exibir checkbox desmarcado quando pendente', () => {
      const task = createMockTask({ completed: false })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      const toggleButton = screen.getByLabelText('Marcar como concluída')
      expect(toggleButton).toBeInTheDocument()
    })

    it('deve aplicar estilo de riscado quando concluída', () => {
      const task = createMockTask({ completed: true, title: 'Tarefa concluída' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      const title = screen.getByText('Tarefa concluída')
      expect(title).toHaveClass('line-through')
    })

    it('não deve aplicar estilo de riscado quando pendente', () => {
      const task = createMockTask({ completed: false, title: 'Tarefa pendente' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      const title = screen.getByText('Tarefa pendente')
      expect(title).not.toHaveClass('line-through')
    })

    it('deve aplicar cor cinza no título quando concluída', () => {
      const task = createMockTask({ completed: true, title: 'Concluída' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByText('Concluída')).toHaveClass('text-gray-400')
    })

    it('deve aplicar cor escura no título quando pendente', () => {
      const task = createMockTask({ completed: false, title: 'Pendente' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByText('Pendente')).toHaveClass('text-gray-900')
    })
  })

  // ========== Interações ==========
  describe('Interações', () => {
    it('deve chamar onToggle com o id ao clicar no checkbox', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-123', completed: false })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      await user.click(screen.getByLabelText('Marcar como concluída'))

      expect(handlers.onToggle).toHaveBeenCalledTimes(1)
      expect(handlers.onToggle).toHaveBeenCalledWith('task-123')
    })

    it('deve chamar onEdit com a task ao clicar em editar', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-456', title: 'Editar esta' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      await user.click(screen.getByLabelText('Editar tarefa'))

      expect(handlers.onEdit).toHaveBeenCalledTimes(1)
      expect(handlers.onEdit).toHaveBeenCalledWith(task)
    })

    it('deve chamar onDelete com o id ao clicar em excluir', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-789' })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      await user.click(screen.getByLabelText('Excluir tarefa'))

      expect(handlers.onDelete).toHaveBeenCalledTimes(1)
      expect(handlers.onDelete).toHaveBeenCalledWith('task-789')
    })
  })

  // ========== Acessibilidade ==========
  describe('Acessibilidade', () => {
    it('deve ter aria-label apropriado no botão de toggle quando pendente', () => {
      const task = createMockTask({ completed: false })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByLabelText('Marcar como concluída')).toBeInTheDocument()
    })

    it('deve ter aria-label apropriado no botão de toggle quando concluída', () => {
      const task = createMockTask({ completed: true })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByLabelText('Marcar como pendente')).toBeInTheDocument()
    })

    it('deve ter aria-label no botão de editar', () => {
      const task = createMockTask()
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByLabelText('Editar tarefa')).toBeInTheDocument()
    })

    it('deve ter aria-label no botão de excluir', () => {
      const task = createMockTask()
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      expect(screen.getByLabelText('Excluir tarefa')).toBeInTheDocument()
    })
  })

  // ========== Estilos Visuais ==========
  describe('Estilos visuais', () => {
    it('deve ter fundo branco quando pendente', () => {
      const task = createMockTask({ completed: false })
      const handlers = createMockHandlers()

      const { container } = render(<TaskCard task={task} {...handlers} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-white')
    })

    it('deve ter fundo cinza quando concluída', () => {
      const task = createMockTask({ completed: true })
      const handlers = createMockHandlers()

      const { container } = render(<TaskCard task={task} {...handlers} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-gray-50')
    })

    it('deve ter checkbox verde quando concluída', () => {
      const task = createMockTask({ completed: true })
      const handlers = createMockHandlers()

      render(<TaskCard task={task} {...handlers} />)

      const checkbox = screen.getByLabelText('Marcar como pendente')
      expect(checkbox).toHaveClass('bg-green-500')
    })
  })
})
