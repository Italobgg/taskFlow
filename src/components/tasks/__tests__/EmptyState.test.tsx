import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyState } from '../EmptyState'
import type { FilterStatus } from '../../../types'

describe('EmptyState', () => {
  // ========== Filtro "all" ==========
  describe('Filtro "all"', () => {
    it('deve renderizar o título correto para filtro "all"', () => {
      render(<EmptyState filter="all" />)

      expect(screen.getByText('Nenhuma tarefa ainda')).toBeInTheDocument()
    })

    it('deve renderizar a descrição correta para filtro "all"', () => {
      render(<EmptyState filter="all" />)

      expect(
        screen.getByText('Comece adicionando sua primeira tarefa usando o formulário acima.')
      ).toBeInTheDocument()
    })

    it('deve renderizar o ícone ClipboardList para filtro "all"', () => {
      const { container } = render(<EmptyState filter="all" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-8', 'h-8', 'text-gray-400')
    })
  })

  // ========== Filtro "pending" ==========
  describe('Filtro "pending"', () => {
    it('deve renderizar o título correto para filtro "pending"', () => {
      render(<EmptyState filter="pending" />)

      expect(screen.getByText('Tudo em dia!')).toBeInTheDocument()
    })

    it('deve renderizar a descrição correta para filtro "pending"', () => {
      render(<EmptyState filter="pending" />)

      expect(
        screen.getByText('Você não tem tarefas pendentes. Que tal adicionar uma nova?')
      ).toBeInTheDocument()
    })

    it('deve renderizar o ícone CheckCircle2 para filtro "pending"', () => {
      const { container } = render(<EmptyState filter="pending" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-8', 'h-8', 'text-gray-400')
    })
  })

  // ========== Filtro "completed" ==========
  describe('Filtro "completed"', () => {
    it('deve renderizar o título correto para filtro "completed"', () => {
      render(<EmptyState filter="completed" />)

      expect(screen.getByText('Nenhuma tarefa concluída')).toBeInTheDocument()
    })

    it('deve renderizar a descrição correta para filtro "completed"', () => {
      render(<EmptyState filter="completed" />)

      expect(
        screen.getByText('Conclua algumas tarefas para vê-las aqui.')
      ).toBeInTheDocument()
    })

    it('deve renderizar o ícone Clock para filtro "completed"', () => {
      const { container } = render(<EmptyState filter="completed" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-8', 'h-8', 'text-gray-400')
    })
  })

  // ========== Estrutura e Layout ==========
  describe('Estrutura e layout', () => {
    it('deve renderizar o container principal com classes corretas', () => {
      const { container } = render(<EmptyState filter="all" />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'py-12',
        'px-4'
      )
    })

    it('deve renderizar o container do ícone com classes corretas', () => {
      const { container } = render(<EmptyState filter="all" />)

      const iconContainer = container.querySelector('.w-16.h-16')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass(
        'bg-gray-100',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'mb-4'
      )
    })

    it('deve renderizar o título com classes corretas', () => {
      render(<EmptyState filter="all" />)

      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900', 'mb-1')
    })

    it('deve renderizar a descrição com classes corretas', () => {
      render(<EmptyState filter="all" />)

      const description = screen.getByText(/comece adicionando/i)
      expect(description).toHaveClass('text-gray-500', 'text-center', 'max-w-sm')
    })
  })

  // ========== Renderização Condicional ==========
  describe('Renderização condicional', () => {
    it('deve mudar o conteúdo quando o filtro muda', () => {
      const { rerender } = render(<EmptyState filter="all" />)

      expect(screen.getByText('Nenhuma tarefa ainda')).toBeInTheDocument()

      rerender(<EmptyState filter="pending" />)

      expect(screen.queryByText('Nenhuma tarefa ainda')).not.toBeInTheDocument()
      expect(screen.getByText('Tudo em dia!')).toBeInTheDocument()

      rerender(<EmptyState filter="completed" />)

      expect(screen.queryByText('Tudo em dia!')).not.toBeInTheDocument()
      expect(screen.getByText('Nenhuma tarefa concluída')).toBeInTheDocument()
    })

    it('deve renderizar diferentes ícones para cada filtro', () => {
      const { container, rerender } = render(<EmptyState filter="all" />)

      // Todos os filtros devem ter um ícone SVG
      expect(container.querySelector('svg')).toBeInTheDocument()

      rerender(<EmptyState filter="pending" />)
      expect(container.querySelector('svg')).toBeInTheDocument()

      rerender(<EmptyState filter="completed" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  // ========== Acessibilidade ==========
  describe('Acessibilidade', () => {
    it('deve ter um heading semântico', () => {
      render(<EmptyState filter="all" />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })

    it('deve ter texto descritivo acessível', () => {
      render(<EmptyState filter="all" />)

      // Verifica que a descrição está presente e é legível
      expect(
        screen.getByText(/comece adicionando sua primeira tarefa/i)
      ).toBeInTheDocument()
    })

    it('deve ter estrutura semântica para cada filtro', () => {
      const filters: FilterStatus[] = ['all', 'pending', 'completed']

      filters.forEach((filter) => {
        const { unmount } = render(<EmptyState filter={filter} />)

        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
        unmount()
      })
    })
  })

  // ========== Todos os Filtros ==========
  describe('Cobertura de todos os filtros', () => {
    const filterConfigs: {
      filter: FilterStatus
      title: string
      description: string
    }[] = [
      {
        filter: 'all',
        title: 'Nenhuma tarefa ainda',
        description: 'Comece adicionando sua primeira tarefa usando o formulário acima.',
      },
      {
        filter: 'pending',
        title: 'Tudo em dia!',
        description: 'Você não tem tarefas pendentes. Que tal adicionar uma nova?',
      },
      {
        filter: 'completed',
        title: 'Nenhuma tarefa concluída',
        description: 'Conclua algumas tarefas para vê-las aqui.',
      },
    ]

    filterConfigs.forEach(({ filter, title, description }) => {
      it(`deve renderizar conteúdo correto para filtro "${filter}"`, () => {
        render(<EmptyState filter={filter} />)

        expect(screen.getByText(title)).toBeInTheDocument()
        expect(screen.getByText(description)).toBeInTheDocument()
      })
    })
  })

  // ========== Snapshot Visual ==========
  describe('Consistência visual', () => {
    it('deve manter estrutura consistente entre filtros', () => {
      const filters: FilterStatus[] = ['all', 'pending', 'completed']

      filters.forEach((filter) => {
        const { container, unmount } = render(<EmptyState filter={filter} />)

        // Verifica que a estrutura básica existe
        expect(container.querySelector('svg')).toBeInTheDocument() // Ícone
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument() // Título
        expect(container.querySelector('p')).toBeInTheDocument() // Descrição

        unmount()
      })
    })

    it('deve ter espaçamento vertical adequado', () => {
      const { container } = render(<EmptyState filter="all" />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('py-12')
    })
  })
})
