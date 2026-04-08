import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskFilters } from '../TaskFilters'
import type { FilterStatus } from '../../../types'

// ========== Factories e Helpers ==========

/**
 * Cria contadores mock para os filtros
 */
const createMockCounts = (overrides = {}) => ({
  total: 10,
  completed: 4,
  pending: 6,
  ...overrides,
})

describe('TaskFilters', () => {
  // ========== Renderização ==========
  describe('Renderização', () => {
    it('deve renderizar o ícone de filtro', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      const { container } = render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-gray-400')
    })

    it('deve renderizar os três botões de filtro', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pendentes/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /concluídas/i })).toBeInTheDocument()
    })

    it('deve renderizar os labels corretos', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      expect(screen.getByText('Todas')).toBeInTheDocument()
      expect(screen.getByText('Pendentes')).toBeInTheDocument()
      expect(screen.getByText('Concluídas')).toBeInTheDocument()
    })
  })

  // ========== Contadores ==========
  describe('Contadores', () => {
    it('deve exibir o contador total no filtro "Todas"', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts({ total: 15 })

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const todasButton = screen.getByRole('button', { name: /todas/i })
      expect(todasButton).toHaveTextContent('15')
    })

    it('deve exibir o contador de pendentes no filtro "Pendentes"', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts({ pending: 8 })

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const pendentesButton = screen.getByRole('button', { name: /pendentes/i })
      expect(pendentesButton).toHaveTextContent('8')
    })

    it('deve exibir o contador de concluídas no filtro "Concluídas"', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts({ completed: 12 })

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const concluidasButton = screen.getByRole('button', { name: /concluídas/i })
      expect(concluidasButton).toHaveTextContent('12')
    })

    it('deve exibir zero quando não há tarefas', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts({ total: 0, pending: 0, completed: 0 })

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveTextContent('0')
      })
    })

    it('deve atualizar os contadores quando props mudam', () => {
      const onFilterChange = vi.fn()
      const initialCounts = createMockCounts({ total: 5, pending: 3, completed: 2 })

      const { rerender } = render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={initialCounts} />
      )

      expect(screen.getByRole('button', { name: /todas/i })).toHaveTextContent('5')

      const updatedCounts = createMockCounts({ total: 10, pending: 7, completed: 3 })

      rerender(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={updatedCounts} />
      )

      expect(screen.getByRole('button', { name: /todas/i })).toHaveTextContent('10')
      expect(screen.getByRole('button', { name: /pendentes/i })).toHaveTextContent('7')
      expect(screen.getByRole('button', { name: /concluídas/i })).toHaveTextContent('3')
    })
  })

  // ========== Interações ==========
  describe('Interações', () => {
    it('deve chamar onFilterChange com "all" ao clicar em Todas', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="pending" onFilterChange={onFilterChange} counts={counts} />
      )

      await user.click(screen.getByRole('button', { name: /todas/i }))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('all')
    })

    it('deve chamar onFilterChange com "pending" ao clicar em Pendentes', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      await user.click(screen.getByRole('button', { name: /pendentes/i }))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('pending')
    })

    it('deve chamar onFilterChange com "completed" ao clicar em Concluídas', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      await user.click(screen.getByRole('button', { name: /concluídas/i }))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('completed')
    })

    it('deve chamar onFilterChange mesmo ao clicar no filtro já ativo', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      await user.click(screen.getByRole('button', { name: /todas/i }))

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(onFilterChange).toHaveBeenCalledWith('all')
    })

    it('deve permitir múltiplos cliques em sequência', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      await user.click(screen.getByRole('button', { name: /pendentes/i }))
      await user.click(screen.getByRole('button', { name: /concluídas/i }))
      await user.click(screen.getByRole('button', { name: /todas/i }))

      expect(onFilterChange).toHaveBeenCalledTimes(3)
      expect(onFilterChange).toHaveBeenNthCalledWith(1, 'pending')
      expect(onFilterChange).toHaveBeenNthCalledWith(2, 'completed')
      expect(onFilterChange).toHaveBeenNthCalledWith(3, 'all')
    })
  })

  // ========== Estilos de Estado Ativo ==========
  describe('Estilos de estado ativo', () => {
    it('deve aplicar estilo ativo no filtro "all" quando selecionado', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const todasButton = screen.getByRole('button', { name: /todas/i })
      expect(todasButton).toHaveClass('bg-primary-100', 'text-primary-700')
    })

    it('deve aplicar estilo ativo no filtro "pending" quando selecionado', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="pending" onFilterChange={onFilterChange} counts={counts} />
      )

      const pendentesButton = screen.getByRole('button', { name: /pendentes/i })
      expect(pendentesButton).toHaveClass('bg-primary-100', 'text-primary-700')
    })

    it('deve aplicar estilo ativo no filtro "completed" quando selecionado', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="completed" onFilterChange={onFilterChange} counts={counts} />
      )

      const concluidasButton = screen.getByRole('button', { name: /concluídas/i })
      expect(concluidasButton).toHaveClass('bg-primary-100', 'text-primary-700')
    })

    it('deve aplicar estilo inativo nos filtros não selecionados', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const pendentesButton = screen.getByRole('button', { name: /pendentes/i })
      const concluidasButton = screen.getByRole('button', { name: /concluídas/i })

      expect(pendentesButton).toHaveClass('text-gray-600')
      expect(pendentesButton).not.toHaveClass('bg-primary-100')

      expect(concluidasButton).toHaveClass('text-gray-600')
      expect(concluidasButton).not.toHaveClass('bg-primary-100')
    })

    it('deve mudar estilos quando o filtro ativo muda', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      const { rerender } = render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const todasButton = screen.getByRole('button', { name: /todas/i })
      const pendentesButton = screen.getByRole('button', { name: /pendentes/i })

      expect(todasButton).toHaveClass('bg-primary-100')
      expect(pendentesButton).not.toHaveClass('bg-primary-100')

      rerender(
        <TaskFilters currentFilter="pending" onFilterChange={onFilterChange} counts={counts} />
      )

      expect(todasButton).not.toHaveClass('bg-primary-100')
      expect(pendentesButton).toHaveClass('bg-primary-100')
    })
  })

  // ========== Estilos do Badge/Contador ==========
  describe('Estilos do badge contador', () => {
    it('deve aplicar estilo ativo no badge do filtro selecionado', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const todasButton = screen.getByRole('button', { name: /todas/i })
      const badge = todasButton.querySelector('span')

      expect(badge).toHaveClass('bg-primary-200', 'text-primary-800')
    })

    it('deve aplicar estilo inativo no badge dos filtros não selecionados', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const pendentesButton = screen.getByRole('button', { name: /pendentes/i })
      const badge = pendentesButton.querySelector('span')

      expect(badge).toHaveClass('bg-gray-200', 'text-gray-600')
    })
  })

  // ========== Estrutura e Layout ==========
  describe('Estrutura e layout', () => {
    it('deve ter container com flex e gap', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      const { container } = render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2')
    })

    it('deve ter flex-wrap para responsividade', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      const { container } = render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex-wrap')
    })

    it('deve renderizar botões com classes de estilo base', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('px-3', 'py-1.5', 'rounded-lg', 'text-sm', 'font-medium')
      })
    })
  })

  // ========== Casos de Borda ==========
  describe('Casos de borda', () => {
    it('deve lidar com contadores grandes', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts({ total: 9999, pending: 5000, completed: 4999 })

      render(
        <TaskFilters currentFilter="all" onFilterChange={onFilterChange} counts={counts} />
      )

      expect(screen.getByRole('button', { name: /todas/i })).toHaveTextContent('9999')
      expect(screen.getByRole('button', { name: /pendentes/i })).toHaveTextContent('5000')
      expect(screen.getByRole('button', { name: /concluídas/i })).toHaveTextContent('4999')
    })

    it('deve renderizar corretamente com todos os filtros', () => {
      const onFilterChange = vi.fn()
      const counts = createMockCounts()
      const filters: FilterStatus[] = ['all', 'pending', 'completed']

      filters.forEach((filter) => {
        const { unmount } = render(
          <TaskFilters currentFilter={filter} onFilterChange={onFilterChange} counts={counts} />
        )

        expect(screen.getAllByRole('button')).toHaveLength(3)
        unmount()
      })
    })
  })
})
