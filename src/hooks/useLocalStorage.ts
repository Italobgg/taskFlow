import { useState, useEffect } from 'react';

/**
 * Hook personalizado para sincronizar estado com localStorage
 * 
 * @param key - Chave para identificar o dado no localStorage
 * @param initialValue - Valor inicial caso não exista nada salvo
 * @returns [valor, função para atualizar] - Similar ao useState
 * 
 * @example
 * const [name, setName] = useLocalStorage('userName', 'Visitante');
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Função que roda apenas na inicialização
  // Tenta ler do localStorage, senão usa o valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Se existe algo salvo, faz o parse do JSON
      // Senão, retorna o valor inicial
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // Se der erro (JSON inválido, etc), usa o valor inicial
      console.warn(`Erro ao ler localStorage["${key}"]:`, error);
      return initialValue;
    }
  });

  // Sempre que o valor mudar, salva no localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Erro ao salvar localStorage["${key}"]:`, error);
    }
  }, [key, storedValue]);

  // Retorna exatamente como o useState: [valor, setValor]
  return [storedValue, setStoredValue] as const;
}
