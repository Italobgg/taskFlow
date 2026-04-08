import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Variantes visuais do botão
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Componente Button reutilizável
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Salvar
 * </Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Classes base que todos os botões têm
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Classes específicas de cada variante
  const variantClasses: Record<ButtonVariant, string> = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      focus:ring-gray-500
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100
      focus:ring-gray-500
    `,
  };

  // Classes de tamanho
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
