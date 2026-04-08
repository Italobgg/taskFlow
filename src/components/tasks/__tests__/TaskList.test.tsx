import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskList } from '../TaskList'
import type { Task, FilterStatus } from '../../../types'

// ========== Factories e Helpers ==========

/**
 * Factory para criar tasks de teste
 */
const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Tarefa de teste',
  description: 'Descrição da tarefa',
  completed: false,
  createdAt: Date.now(),
  ...overrides,
})

/**
 * Cria múltiplas tasks para teste
 */
const createMockTasks = (count: number): Task[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      id: `task-${index + 1}`,
      title: `Tarefa ${index + 1}`,
      description: `Descrição ${index + 1}`,
      completed: index % 2 === 0, // Alterna entre completa e pendente
    })
  )
}

/**
 * Cria os handlers mock
 */
const createMockHandlers = () => ({
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
})

describe('TaskList', () => {
  // ========== Renderização de Lista ==========
  describe('Renderização de lista', () => {
    it('deve renderizar todas as tarefas da lista', () => {
      const tasks = createMockTasks(3)
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
    })

    it('deve renderizar as descrições das tarefas', () => {
      const tasks = createMockTasks(2)
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      expect(screen.getByText('Descrição 1')).toBeInTheDocument()
      expect(screen.getByText('Descrição 2')).toBeInTheDocument()
    })

    it('deve renderizar uma única tarefa corretamente', () => {
      const tasks = [createMockTask({ title: 'Única tarefa' })]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      expect(screen.getByText('Única tarefa')).toBeInTheDocument()
    })

    it('deve renderizar lista com muitas tarefas', () => {
      const tasks = createMockTasks(10)
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 10')).toBeInTheDocument()
    })

    it('deve aplicar a classe de espaçamento no container', () => {
      const tasks = createMockTasks(2)
      const handlers = createMockHandlers()

      const { container } = render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      const listContainer = container.firstChild as HTMLElement
      expect(listContainer).toHaveClass('space-y-3')
    })
  })

  // ========== Estado Vazio ==========
  describe('Estado vazio', () => {
    it('deve renderizar EmptyState quando não há tarefas', () => {
      const handlers = createMockHandlers()

      render(<TaskList tasks={[]} filter="all" {...handlers} />)

      // Verifica se o EmptyState está presente (deve ter algum texto ou elemento característico)
      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
    })

    it('deve passar o filtro "all" para o EmptyState', () => {
      const handlers = createMockHandlers()

      render(<TaskList tasks={[]} filter="all" {...handlers} />)

      // EmptyState para "all" deve mostrar mensagem de lista vazia
      expect(screen.getByText(/nenhuma tarefa/i)).toBeInTheDocument()
    })

    it('deve passar o filtro "pending" para o EmptyState', () => {
      const handlers = createMockHandlers()

      render(<TaskList tasks={[]} filter="pending" {...handlers} />)

      // EmptyState para "pending" deve mostrar mensagem específica
      expect(screen.getByText(/pendente/i)).toBeInTheDocument()
    })

    it('deve passar o filtro "completed" para o EmptyState', () => {
      const handlers = createMockHandlers()

      render(<TaskList tasks={[]} filter="completed" {...handlers} />)

      // EmptyState para "completed" deve mostrar mensagem específica
      expect(screen.getByText(/concluída/i)).toBeInTheDocument()
    })

    it('não deve renderizar TaskCards quando lista está vazia', () => {
      const handlers = createMockHandlers()

      render(<TaskList tasks={[]} filter="all" {...handlers} />)

      expect(screen.queryByLabelText('Editar tarefa')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Excluir tarefa')).not.toBeInTheDocument()
    })
  })

  // ========== Interações ==========
  describe('Interações', () => {
    it('deve chamar onToggle com o id correto ao clicar no checkbox', async () => {
      const user = userEvent.setup()
      const tasks = [createMockTask({ id: 'task-abc', completed: false })]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      await user.click(screen.getByLabelText('Marcar como concluída'))

      expect(handlers.onToggle).toHaveBeenCalledTimes(1)
      expect(handlers.onToggle).toHaveBeenCalledWith('task-abc')
    })

    it('deve chamar onEdit com a task correta ao clicar em editar', async () => {
      const user = userEvent.setup()
      const task = createMockTask({ id: 'task-xyz', title: 'Editar esta' })
      const handlers = createMockHandlers()

      render(<TaskList tasks={[task]} filter="all" {...handlers} />)

      await user.click(screen.getByLabelText('Editar tarefa'))

      expect(handlers.onEdit).toHaveBeenCalledTimes(1)
      expect(handlers.onEdit).toHaveBeenCalledWith(task)
    })

    it('deve chamar onDelete com o id correto ao clicar em excluir', async () => {
      const user = userEvent.setup()
      const tasks = [createMockTask({ id: 'task-del' })]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      await user.click(screen.getByLabelText('Excluir tarefa'))

      expect(handlers.onDelete).toHaveBeenCalledTimes(1)
      expect(handlers.onDelete).toHaveBeenCalledWith('task-del')
    })

    it('deve chamar o handler correto para cada tarefa na lista', async () => {
      const user = userEvent.setup()
      const tasks = [
        createMockTask({ id: 'task-1', title: 'Primeira', completed: false }),
        createMockTask({ id: 'task-2', title: 'Segunda', completed: false }),
      ]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      // Pega todos os botões de toggle
      const toggleButtons = screen.getAllByLabelText('Marcar como concluída')

      // Clica no primeiro
      await user.click(toggleButtons[0])
      expect(handlers.onToggle).toHaveBeenCalledWith('task-1')

      // Clica no segundo
      await user.click(toggleButtons[1])
      expect(handlers.onToggle).toHaveBeenCalledWith('task-2')

      expect(handlers.onToggle).toHaveBeenCalledTimes(2)
    })
  })

  // ========== Renderização Condicional por Status ==========
  describe('Renderização condicional por status', () => {
    it('deve renderizar tarefas completas com estilo de riscado', () => {
      const tasks = [createMockTask({ title: 'Tarefa completa', completed: true })]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      const title = screen.getByText('Tarefa completa')
      expect(title).toHaveClass('line-through')
    })

    it('deve renderizar tarefas pendentes sem estilo de riscado', () => {
      const tasks = [createMockTask({ title: 'Tarefa pendente', completed: false })]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      const title = screen.getByText('Tarefa pendente')
      expect(title).not.toHaveClass('line-through')
    })

    it('deve renderizar mix de tarefas completas e pendentes', () => {
      const tasks = [
        createMockTask({ id: '1', title: 'Completa', completed: true }),
        createMockTask({ id: '2', title: 'Pendente', completed: false }),
      ]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      expect(screen.getByText('Completa')).toHaveClass('line-through')
      expect(screen.getByText('Pendente')).not.toHaveClass('line-through')
    })
  })

  // ========== Props de Filtro ==========
  describe('Props de filtro', () => {
    const filters: FilterStatus[] = ['all', 'pending', 'completed']

    filters.forEach((filter) => {
      it(`deve aceitar filter="${filter}" sem erros`, () => {
        const tasks = createMockTasks(2)
        const handlers = createMockHandlers()

        expect(() => {
          render(<TaskList tasks={tasks} filter={filter} {...handlers} />)
        }).not.toThrow()
      })
    })

    it('deve passar o filtro para EmptyState quando lista vazia', () => {
      const handlers = createMockHandlers()

      const { rerender } = render(<TaskList tasks={[]} filter="all" {...handlers} />)
      expect(screen.getByText(/nenhuma tarefa/i)).toBeInTheDocument()

      rerender(<TaskList tasks={[]} filter="pending" {...handlers} />)
      expect(screen.getByText(/pendente/i)).toBeInTheDocument()

      rerender(<TaskList tasks={[]} filter="completed" {...handlers} />)
      expect(screen.getByText(/concluída/i)).toBeInTheDocument()
    })
  })

  // ========== Keys e Performance ==========
  describe('Keys e estrutura', () => {
    it('deve renderizar cada tarefa com key única (sem warnings)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const tasks = createMockTasks(5)
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      // Verifica se não houve warning de key duplicada
      const keyWarnings = consoleSpy.mock.calls.filter(
        (call) => call[0]?.toString().includes('key')
      )
      expect(keyWarnings).toHaveLength(0)

      consoleSpy.mockRestore()
    })

    it('deve manter a ordem das tarefas conforme recebidas', () => {
      const tasks = [
        createMockTask({ id: '1', title: 'Primeira' }),
        createMockTask({ id: '2', title: 'Segunda' }),
        createMockTask({ id: '3', title: 'Terceira' }),
      ]
      const handlers = createMockHandlers()

      render(<TaskList tasks={tasks} filter="all" {...handlers} />)

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles[0]).toHaveTextContent('Primeira')
      expect(titles[1]).toHaveTextContent('Segunda')
      expect(titles[2]).toHaveTextContent('Terceira')
    })
  })

  // ========== Atualização Dinâmica ==========
  describe('Atualização dinâmica', () => {
    it('deve atualizar quando tarefas são adicionadas', () => {
      const handlers = createMockHandlers()
      const initialTasks = [createMockTask({ id: '1', title: 'Tarefa 1' })]

      const { rerender } = render(
        <TaskList tasks={initialTasks} filter="all" {...handlers} />
      )

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument()

      const updatedTasks = [
        ...initialTasks,
        createMockTask({ id: '2', title: 'Tarefa 2' }),
      ]

      rerender(<TaskList tasks={updatedTasks} filter="all" {...handlers} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    it('deve atualizar quando tarefas são removidas', () => {
      const handlers = createMockHandlers()
      const initialTasks = createMockTasks(3)

      const { rerender } = render(
        <TaskList tasks={initialTasks} filter="all" {...handlers} />
      )

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 3')).toBeInTheDocument()

      // Remove a segunda tarefa
      const updatedTasks = [initialTasks[0], initialTasks[2]]

      rerender(<TaskList tasks={updatedTasks} filter="all" {...handlers} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument()
      expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
    })

    it('deve mostrar EmptyState quando todas as tarefas são removidas', () => {
      const handlers = createMockHandlers()
      const initialTasks = createMockTasks(2)

      const { rerender } = render(
        <TaskList tasks={initialTasks} filter="all" {...handlers} />
      )

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()

      rerender(<TaskList tasks={[]} filter="all" {...handlers} />)

      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
      expect(screen.getByText(/nenhuma tarefa/i)).toBeInTheDocument()
    })
  })
})
