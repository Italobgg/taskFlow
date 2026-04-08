import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskForm } from '../TaskForm'
import type { Task } from '../../../types'

// ========== Factories e Helpers ==========

/**
 * Factory para criar tasks de teste
 */
const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Tarefa existente',
  description: 'Descrição existente',
  completed: false,
  createdAt: Date.now(),
  ...overrides,
})

describe('TaskForm', () => {
  // ========== Renderização ==========
  describe('Renderização', () => {
    it('deve renderizar o formulário com campos vazios', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('')
      expect(screen.getByLabelText('Descrição da tarefa')).toHaveValue('')
    })

    it('deve renderizar o placeholder do título', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByPlaceholderText('O que você precisa fazer?')).toBeInTheDocument()
    })

    it('deve renderizar o placeholder da descrição', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByPlaceholderText('Descrição (opcional)')).toBeInTheDocument()
    })

    it('deve renderizar o botão de adicionar no modo criação', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByRole('button', { name: /adicionar tarefa/i })).toBeInTheDocument()
    })

    it('não deve renderizar o botão cancelar no modo criação', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
    })
  })

  // ========== Modo de Edição ==========
  describe('Modo de edição', () => {
    it('deve preencher os campos com dados da tarefa em edição', () => {
      const onSubmit = vi.fn()
      const task = createMockTask({
        title: 'Título para editar',
        description: 'Descrição para editar',
      })

      render(<TaskForm onSubmit={onSubmit} editingTask={task} />)

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('Título para editar')
      expect(screen.getByLabelText('Descrição da tarefa')).toHaveValue('Descrição para editar')
    })

    it('deve renderizar o botão de salvar no modo edição', () => {
      const onSubmit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} />)

      expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument()
    })

    it('deve renderizar o botão de cancelar no modo edição', () => {
      const onSubmit = vi.fn()
      const onCancelEdit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} onCancelEdit={onCancelEdit} />)

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })

    it('deve atualizar os campos quando editingTask mudar', () => {
      const onSubmit = vi.fn()
      const task1 = createMockTask({ title: 'Tarefa 1', description: 'Desc 1' })
      const task2 = createMockTask({ title: 'Tarefa 2', description: 'Desc 2' })

      const { rerender } = render(<TaskForm onSubmit={onSubmit} editingTask={task1} />)

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('Tarefa 1')

      rerender(<TaskForm onSubmit={onSubmit} editingTask={task2} />)

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('Tarefa 2')
      expect(screen.getByLabelText('Descrição da tarefa')).toHaveValue('Desc 2')
    })
  })

  // ========== Validação ==========
  describe('Validação', () => {
    it('deve exibir erro quando título está vazio', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('deve exibir erro quando título contém apenas espaços', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText('Título da tarefa'), '   ')
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('deve limpar erro ao digitar no campo de título', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      // Provoca o erro
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()

      // Digita algo
      await user.type(screen.getByLabelText('Título da tarefa'), 'N')

      // Erro deve sumir
      expect(screen.queryByText('O título é obrigatório')).not.toBeInTheDocument()
    })

    it('não deve exigir descrição para submeter', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText('Título da tarefa'), 'Tarefa sem descrição')
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(onSubmit).toHaveBeenCalledWith('Tarefa sem descrição', '')
    })
  })

  // ========== Submissão ==========
  describe('Submissão', () => {
    it('deve chamar onSubmit com título e descrição ao submeter', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText('Título da tarefa'), 'Nova tarefa')
      await user.type(screen.getByLabelText('Descrição da tarefa'), 'Descrição da nova tarefa')
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('Nova tarefa', 'Descrição da nova tarefa')
    })

    it('deve fazer trim do título e descrição ao submeter', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText('Título da tarefa'), '  Título com espaços  ')
      await user.type(screen.getByLabelText('Descrição da tarefa'), '  Descrição com espaços  ')
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(onSubmit).toHaveBeenCalledWith('Título com espaços', 'Descrição com espaços')
    })

    it('deve limpar os campos após submissão bem-sucedida', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText('Título da tarefa'), 'Tarefa')
      await user.type(screen.getByLabelText('Descrição da tarefa'), 'Descrição')
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }))

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('')
      expect(screen.getByLabelText('Descrição da tarefa')).toHaveValue('')
    })

    it('deve submeter ao pressionar Enter no campo de título', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      const titleInput = screen.getByLabelText('Título da tarefa')
      await user.type(titleInput, 'Tarefa via Enter{Enter}')

      expect(onSubmit).toHaveBeenCalledWith('Tarefa via Enter', '')
    })

    it('deve chamar onSubmit com dados editados no modo edição', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const task = createMockTask({ title: 'Original', description: 'Desc original' })

      render(<TaskForm onSubmit={onSubmit} editingTask={task} />)

      const titleInput = screen.getByLabelText('Título da tarefa')
      const descInput = screen.getByLabelText('Descrição da tarefa')

      await user.clear(titleInput)
      await user.type(titleInput, 'Editado')
      await user.clear(descInput)
      await user.type(descInput, 'Desc editada')
      await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

      expect(onSubmit).toHaveBeenCalledWith('Editado', 'Desc editada')
    })
  })

  // ========== Cancelamento ==========
  describe('Cancelamento', () => {
    it('deve chamar onCancelEdit ao clicar em cancelar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const onCancelEdit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} onCancelEdit={onCancelEdit} />)

      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(onCancelEdit).toHaveBeenCalledTimes(1)
    })

    it('deve limpar os campos ao cancelar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const onCancelEdit = vi.fn()
      const task = createMockTask({ title: 'Tarefa', description: 'Descrição' })

      render(<TaskForm onSubmit={onSubmit} editingTask={task} onCancelEdit={onCancelEdit} />)

      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(screen.getByLabelText('Título da tarefa')).toHaveValue('')
      expect(screen.getByLabelText('Descrição da tarefa')).toHaveValue('')
    })

    it('deve limpar o erro ao cancelar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const onCancelEdit = vi.fn()
      const task = createMockTask({ title: '', description: '' })

      render(<TaskForm onSubmit={onSubmit} editingTask={task} onCancelEdit={onCancelEdit} />)

      // Limpa o título e tenta submeter para gerar erro
      const titleInput = screen.getByLabelText('Título da tarefa')
      await user.clear(titleInput)
      await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()

      // Cancela
      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(screen.queryByText('O título é obrigatório')).not.toBeInTheDocument()
    })

    it('não deve chamar onSubmit ao cancelar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      const onCancelEdit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} onCancelEdit={onCancelEdit} />)

      await user.click(screen.getByRole('button', { name: /cancelar/i }))

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  // ========== Interações de Digitação ==========
  describe('Interações de digitação', () => {
    it('deve atualizar o valor do título ao digitar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      const titleInput = screen.getByLabelText('Título da tarefa')
      await user.type(titleInput, 'Digitando título')

      expect(titleInput).toHaveValue('Digitando título')
    })

    it('deve atualizar o valor da descrição ao digitar', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      const descInput = screen.getByLabelText('Descrição da tarefa')
      await user.type(descInput, 'Digitando descrição')

      expect(descInput).toHaveValue('Digitando descrição')
    })
  })

  // ========== Acessibilidade ==========
  describe('Acessibilidade', () => {
    it('deve ter aria-label no campo de título', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByLabelText('Título da tarefa')).toBeInTheDocument()
    })

    it('deve ter aria-label no campo de descrição', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      expect(screen.getByLabelText('Descrição da tarefa')).toBeInTheDocument()
    })

    it('deve ter botão de submit acessível', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      const submitButton = screen.getByRole('button', { name: /adicionar tarefa/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('deve ter botão de cancelar do tipo button (não submit)', () => {
      const onSubmit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      expect(cancelButton).toHaveAttribute('type', 'button')
    })
  })

  // ========== Estilos e Estrutura ==========
  describe('Estilos e estrutura', () => {
    it('deve renderizar o formulário com classes de estilo', () => {
      const onSubmit = vi.fn()

      const { container } = render(<TaskForm onSubmit={onSubmit} />)

      const form = container.querySelector('form')
      expect(form).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm')
    })

    it('deve renderizar ícone Plus no botão de adicionar', () => {
      const onSubmit = vi.fn()

      render(<TaskForm onSubmit={onSubmit} />)

      const button = screen.getByRole('button', { name: /adicionar tarefa/i })
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('deve renderizar ícone X no botão de cancelar', () => {
      const onSubmit = vi.fn()
      const task = createMockTask()

      render(<TaskForm onSubmit={onSubmit} editingTask={task} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      const svg = cancelButton.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })
})
