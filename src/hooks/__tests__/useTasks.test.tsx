import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTasks } from '../useTasks'

// ========== Mock do localStorage ==========

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get store() {
      return store
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// ========== Mock do uuid ==========

vi.mock('uuid', () => ({
  v4: vi.fn(() => `mock-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
}))

describe('useTasks', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  // ========== Estado Inicial ==========
  describe('Estado inicial', () => {
    it('deve iniciar com lista de tarefas vazia', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toEqual([])
    })

    it('deve iniciar com filtro "all"', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.filter).toBe('all')
    })

    it('deve iniciar com contadores zerados', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.counts).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
      })
    })

    it('deve carregar tarefas do localStorage se existirem', () => {
      const savedTasks = [
        {
          id: '1',
          title: 'Tarefa salva',
          description: '',
          completed: false,
          createdAt: Date.now(),
        },
      ]
      localStorageMock.setItem('taskflow-tasks', JSON.stringify(savedTasks))

      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Tarefa salva')
    })

    it('deve carregar filtro do localStorage se existir', () => {
      localStorageMock.setItem('taskflow-filter', JSON.stringify('pending'))

      const { result } = renderHook(() => useTasks())

      expect(result.current.filter).toBe('pending')
    })
  })

  // ========== addTask ==========
  describe('addTask', () => {
    it('deve adicionar uma nova tarefa', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Nova tarefa', 'Descrição')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Nova tarefa')
      expect(result.current.tasks[0].description).toBe('Descrição')
    })

    it('deve criar tarefa com completed=false', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      expect(result.current.tasks[0].completed).toBe(false)
    })

    it('deve gerar id único para cada tarefa', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      expect(result.current.tasks[0].id).not.toBe(result.current.tasks[1].id)
    })

    it('deve gerar createdAt com timestamp', () => {
      const { result } = renderHook(() => useTasks())
      const beforeAdd = Date.now()

      act(() => {
        result.current.addTask('Tarefa')
      })

      const afterAdd = Date.now()
      const createdAt = result.current.tasks[0].createdAt

      expect(createdAt).toBeGreaterThanOrEqual(beforeAdd)
      expect(createdAt).toBeLessThanOrEqual(afterAdd)
    })

    it('deve adicionar tarefa no início da lista (mais recente primeiro)', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Primeira')
      })

      act(() => {
        result.current.addTask('Segunda')
      })

      expect(result.current.tasks[0].title).toBe('Segunda')
      expect(result.current.tasks[1].title).toBe('Primeira')
    })

    it('deve fazer trim no título', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('  Título com espaços  ')
      })

      expect(result.current.tasks[0].title).toBe('Título com espaços')
    })

    it('deve fazer trim na descrição', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Título', '  Descrição com espaços  ')
      })

      expect(result.current.tasks[0].description).toBe('Descrição com espaços')
    })

    it('deve aceitar descrição vazia por padrão', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa sem descrição')
      })

      expect(result.current.tasks[0].description).toBe('')
    })

    it('deve atualizar os contadores ao adicionar', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      expect(result.current.counts).toEqual({
        total: 1,
        completed: 0,
        pending: 1,
      })
    })
  })

  // ========== updateTask ==========
  describe('updateTask', () => {
    it('deve atualizar o título de uma tarefa', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Título original')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.updateTask(taskId, { title: 'Título atualizado' })
      })

      expect(result.current.tasks[0].title).toBe('Título atualizado')
    })

    it('deve atualizar a descrição de uma tarefa', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa', 'Descrição original')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.updateTask(taskId, { description: 'Descrição atualizada' })
      })

      expect(result.current.tasks[0].description).toBe('Descrição atualizada')
    })

    it('deve atualizar múltiplos campos de uma vez', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Título', 'Descrição')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.updateTask(taskId, {
          title: 'Novo título',
          description: 'Nova descrição',
          completed: true,
        })
      })

      expect(result.current.tasks[0].title).toBe('Novo título')
      expect(result.current.tasks[0].description).toBe('Nova descrição')
      expect(result.current.tasks[0].completed).toBe(true)
    })

    it('deve manter outros campos inalterados', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa', 'Descrição')
      })

      const taskId = result.current.tasks[0].id
      const originalCreatedAt = result.current.tasks[0].createdAt

      act(() => {
        result.current.updateTask(taskId, { title: 'Novo título' })
      })

      expect(result.current.tasks[0].description).toBe('Descrição')
      expect(result.current.tasks[0].createdAt).toBe(originalCreatedAt)
    })

    it('não deve afetar outras tarefas', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      const task2Id = result.current.tasks[0].id

      act(() => {
        result.current.updateTask(task2Id, { title: 'Tarefa 2 atualizada' })
      })

      expect(result.current.tasks[1].title).toBe('Tarefa 1')
    })

    it('não deve fazer nada se id não existir', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      act(() => {
        result.current.updateTask('id-inexistente', { title: 'Não existe' })
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Tarefa')
    })
  })

  // ========== deleteTask ==========
  describe('deleteTask', () => {
    it('deve remover uma tarefa pelo id', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa para remover')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.deleteTask(taskId)
      })

      expect(result.current.tasks).toHaveLength(0)
    })

    it('deve remover apenas a tarefa especificada', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
        result.current.addTask('Tarefa 3')
      })

      // Tarefa 2 está no índice 1 (ordem: 3, 2, 1)
      const task2Id = result.current.tasks[1].id

      act(() => {
        result.current.deleteTask(task2Id)
      })

      expect(result.current.tasks).toHaveLength(2)
      expect(result.current.tasks[0].title).toBe('Tarefa 3')
      expect(result.current.tasks[1].title).toBe('Tarefa 1')
    })

    it('não deve fazer nada se id não existir', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      act(() => {
        result.current.deleteTask('id-inexistente')
      })

      expect(result.current.tasks).toHaveLength(1)
    })

    it('deve atualizar os contadores ao remover', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      expect(result.current.counts.total).toBe(2)

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.deleteTask(taskId)
      })

      expect(result.current.counts.total).toBe(1)
      expect(result.current.counts.pending).toBe(1)
    })
  })

  // ========== toggleTask ==========
  describe('toggleTask', () => {
    it('deve marcar tarefa pendente como concluída', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      const taskId = result.current.tasks[0].id
      expect(result.current.tasks[0].completed).toBe(false)

      act(() => {
        result.current.toggleTask(taskId)
      })

      expect(result.current.tasks[0].completed).toBe(true)
    })

    it('deve marcar tarefa concluída como pendente', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      const taskId = result.current.tasks[0].id

      // Completa
      act(() => {
        result.current.toggleTask(taskId)
      })

      expect(result.current.tasks[0].completed).toBe(true)

      // Descompleta
      act(() => {
        result.current.toggleTask(taskId)
      })

      expect(result.current.tasks[0].completed).toBe(false)
    })

    it('não deve afetar outras tarefas', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      const task2Id = result.current.tasks[0].id

      act(() => {
        result.current.toggleTask(task2Id)
      })

      expect(result.current.tasks[0].completed).toBe(true)
      expect(result.current.tasks[1].completed).toBe(false)
    })

    it('deve atualizar os contadores ao alternar', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      expect(result.current.counts).toEqual({
        total: 1,
        completed: 0,
        pending: 1,
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.toggleTask(taskId)
      })

      expect(result.current.counts).toEqual({
        total: 1,
        completed: 1,
        pending: 0,
      })
    })

    it('não deve fazer nada se id não existir', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      act(() => {
        result.current.toggleTask('id-inexistente')
      })

      expect(result.current.tasks[0].completed).toBe(false)
    })
  })

  // ========== setFilter ==========
  describe('setFilter', () => {
    it('deve mudar o filtro para "pending"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.setFilter('pending')
      })

      expect(result.current.filter).toBe('pending')
    })

    it('deve mudar o filtro para "completed"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.setFilter('completed')
      })

      expect(result.current.filter).toBe('completed')
    })

    it('deve mudar o filtro de volta para "all"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.setFilter('pending')
      })

      act(() => {
        result.current.setFilter('all')
      })

      expect(result.current.filter).toBe('all')
    })
  })

  // ========== filteredTasks ==========
  describe('filteredTasks', () => {
    it('deve retornar todas as tarefas quando filtro é "all"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      // Completa uma tarefa
      act(() => {
        result.current.toggleTask(result.current.tasks[0].id)
      })

      expect(result.current.tasks).toHaveLength(2)
    })

    it('deve retornar apenas tarefas pendentes quando filtro é "pending"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Pendente')
        result.current.addTask('Completa')
      })

      // Completa a segunda tarefa adicionada (índice 0 pois é LIFO)
      act(() => {
        result.current.toggleTask(result.current.tasks[0].id)
      })

      act(() => {
        result.current.setFilter('pending')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Pendente')
    })

    it('deve retornar apenas tarefas concluídas quando filtro é "completed"', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Pendente')
        result.current.addTask('Completa')
      })

      // Completa a segunda tarefa adicionada (índice 0)
      act(() => {
        result.current.toggleTask(result.current.tasks[0].id)
      })

      act(() => {
        result.current.setFilter('completed')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('Completa')
    })

    it('deve retornar lista vazia se não houver tarefas no filtro', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Pendente')
      })

      act(() => {
        result.current.setFilter('completed')
      })

      expect(result.current.tasks).toHaveLength(0)
    })

    it('deve atualizar filteredTasks quando tarefa é toggled', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
        result.current.setFilter('completed')
      })

      expect(result.current.tasks).toHaveLength(0)

      // Obtém o id da tarefa (precisa pegar do filtro "all")
      act(() => {
        result.current.setFilter('all')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.toggleTask(taskId)
        result.current.setFilter('completed')
      })

      expect(result.current.tasks).toHaveLength(1)
    })
  })

  // ========== counts ==========
  describe('counts', () => {
    it('deve calcular corretamente com tarefas mistas', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
        result.current.addTask('Tarefa 3')
      })

      // Completa 2 tarefas
      act(() => {
        result.current.toggleTask(result.current.tasks[0].id)
        result.current.toggleTask(result.current.tasks[1].id)
      })

      expect(result.current.counts).toEqual({
        total: 3,
        completed: 2,
        pending: 1,
      })
    })

    it('deve atualizar counts ao adicionar tarefa', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.counts.total).toBe(0)

      act(() => {
        result.current.addTask('Tarefa')
      })

      expect(result.current.counts.total).toBe(1)
      expect(result.current.counts.pending).toBe(1)
    })

    it('deve atualizar counts ao remover tarefa', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      const taskId = result.current.tasks[0].id

      act(() => {
        result.current.deleteTask(taskId)
      })

      expect(result.current.counts.total).toBe(0)
    })

    it('deve manter counts independente do filtro atual', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa 1')
        result.current.addTask('Tarefa 2')
      })

      act(() => {
        result.current.toggleTask(result.current.tasks[0].id)
      })

      // Muda para filtro que mostra apenas 1 tarefa
      act(() => {
        result.current.setFilter('completed')
      })

      // Counts deve refletir TODAS as tarefas, não apenas as filtradas
      expect(result.current.counts).toEqual({
        total: 2,
        completed: 1,
        pending: 1,
      })
    })
  })

  // ========== Persistência ==========
  describe('Persistência no localStorage', () => {
    it('deve salvar tarefas no localStorage ao adicionar', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa persistida')
      })

      const savedTasks = JSON.parse(localStorageMock.store['taskflow-tasks'])
      expect(savedTasks).toHaveLength(1)
      expect(savedTasks[0].title).toBe('Tarefa persistida')
    })

    it('deve salvar filtro no localStorage ao mudar', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.setFilter('pending')
      })

      const savedFilter = JSON.parse(localStorageMock.store['taskflow-filter'])
      expect(savedFilter).toBe('pending')
    })

    it('deve persistir tarefas entre re-renders', () => {
      const { result, rerender } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Tarefa')
      })

      rerender()

      expect(result.current.tasks).toHaveLength(1)
    })
  })

  // ========== Casos de Borda ==========
  describe('Casos de borda', () => {
    it('deve lidar com muitas tarefas', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addTask(`Tarefa ${i}`)
        }
      })

      expect(result.current.tasks).toHaveLength(100)
      expect(result.current.counts.total).toBe(100)
    })

    it('deve manter a ordem das operações CRUD', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Primeira')
        result.current.addTask('Segunda')
        result.current.addTask('Terceira')
      })

      // Ordem: Terceira, Segunda, Primeira (LIFO)
      expect(result.current.tasks[0].title).toBe('Terceira')

      // Remove a do meio
      act(() => {
        result.current.deleteTask(result.current.tasks[1].id)
      })

      // Ordem: Terceira, Primeira
      expect(result.current.tasks).toHaveLength(2)
      expect(result.current.tasks[0].title).toBe('Terceira')
      expect(result.current.tasks[1].title).toBe('Primeira')
    })
  })
})
