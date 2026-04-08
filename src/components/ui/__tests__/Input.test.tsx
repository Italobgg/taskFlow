import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { createRef } from 'react'
import { Input } from '../Input'

describe('Input', () => {
  // ========== Renderização Básica ==========
  describe('Renderização', () => {
    it('deve renderizar o input', () => {
      render(<Input placeholder="Digite algo" />)
      
      expect(screen.getByPlaceholderText('Digite algo')).toBeInTheDocument()
    })

    it('deve renderizar o label quando fornecido', () => {
      render(<Input label="Nome completo" />)
      
      expect(screen.getByText('Nome completo')).toBeInTheDocument()
    })

    it('deve associar o label ao input corretamente', () => {
      render(<Input label="Email" placeholder="Digite seu email" />)
      
      const input = screen.getByPlaceholderText('Digite seu email')
      const label = screen.getByText('Email')
      
      expect(label).toHaveAttribute('for', input.id)
    })

    it('deve usar o id fornecido', () => {
      render(<Input id="meu-input" label="Campo" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'meu-input')
    })

    it('deve gerar id único quando não fornecido', () => {
      render(<Input label="Campo" />)
      
      const input = screen.getByRole('textbox')
      expect(input.id).toMatch(/^input-/)
    })
  })

  // ========== Interação ==========
  describe('Interação', () => {
    it('deve atualizar o valor ao digitar', async () => {
      const user = userEvent.setup()
      
      render(<Input placeholder="Digite" />)
      
      const input = screen.getByPlaceholderText('Digite')
      await user.type(input, 'Olá mundo')
      
      expect(input).toHaveValue('Olá mundo')
    })

    it('deve chamar onChange ao digitar', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onChange={handleChange} placeholder="Digite" />)
      
      await user.type(screen.getByPlaceholderText('Digite'), 'abc')
      
      expect(handleChange).toHaveBeenCalledTimes(3) // Uma vez por letra
    })

    it('deve chamar onFocus ao focar', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onFocus={handleFocus} placeholder="Digite" />)
      
      await user.click(screen.getByPlaceholderText('Digite'))
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('deve chamar onBlur ao perder foco', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()
      
      render(<Input onBlur={handleBlur} placeholder="Digite" />)
      
      const input = screen.getByPlaceholderText('Digite')
      await user.click(input)
      await user.tab() // Move o foco para fora
      
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  // ========== Estado Desabilitado ==========
  describe('Estado desabilitado', () => {
    it('deve estar desabilitado quando disabled=true', () => {
      render(<Input disabled placeholder="Desabilitado" />)
      
      expect(screen.getByPlaceholderText('Desabilitado')).toBeDisabled()
    })

    it('não deve permitir digitação quando desabilitado', async () => {
      const user = userEvent.setup()
      
      render(<Input disabled placeholder="Desabilitado" />)
      
      const input = screen.getByPlaceholderText('Desabilitado')
      await user.type(input, 'texto')
      
      expect(input).toHaveValue('')
    })
  })

  // ========== Erro ==========
  describe('Estado de erro', () => {
    it('deve exibir mensagem de erro quando fornecida', () => {
      render(<Input error="Campo obrigatório" />)
      
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    })

    it('deve aplicar classe de erro no input', () => {
      render(<Input error="Erro" placeholder="Input" />)
      
      const input = screen.getByPlaceholderText('Input')
      expect(input).toHaveClass('border-red-500')
    })

    it('não deve exibir mensagem de erro quando não há erro', () => {
      render(<Input placeholder="Sem erro" />)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  // ========== forwardRef ==========
  describe('forwardRef', () => {
    it('deve aceitar ref e permitir acesso ao elemento', () => {
      const ref = createRef<HTMLInputElement>()
      
      render(<Input ref={ref} placeholder="Com ref" />)
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current?.placeholder).toBe('Com ref')
    })

    it('deve permitir foco programático via ref', () => {
      const ref = createRef<HTMLInputElement>()
      
      render(<Input ref={ref} placeholder="Focável" />)
      
      ref.current?.focus()
      
      expect(screen.getByPlaceholderText('Focável')).toHaveFocus()
    })
  })

  // ========== Classes customizadas ==========
  describe('Classes customizadas', () => {
    it('deve aceitar className adicional', () => {
      render(<Input className="minha-classe" placeholder="Custom" />)
      
      const input = screen.getByPlaceholderText('Custom')
      expect(input).toHaveClass('minha-classe')
    })

    it('deve manter classes padrão junto com className', () => {
      render(<Input className="minha-classe" placeholder="Custom" />)
      
      const input = screen.getByPlaceholderText('Custom')
      expect(input).toHaveClass('w-full', 'px-4', 'minha-classe')
    })
  })

  // ========== Tipos de input ==========
  describe('Tipos de input', () => {
    it('deve aceitar type="password"', () => {
      render(<Input type="password" placeholder="Senha" />)
      
      expect(screen.getByPlaceholderText('Senha')).toHaveAttribute('type', 'password')
    })

    it('deve aceitar type="email"', () => {
      render(<Input type="email" placeholder="Email" />)
      
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
    })

    it('deve aceitar type="number"', () => {
      render(<Input type="number" placeholder="Número" />)
      
      expect(screen.getByPlaceholderText('Número')).toHaveAttribute('type', 'number')
    })
  })
})
