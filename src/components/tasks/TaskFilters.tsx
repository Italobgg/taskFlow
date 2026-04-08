import { ListFilter } from 'lucide-react';
import type { FilterStatus } from '../../types';

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: {
    total: number;
    completed: number;
    pending: number;
  };
}

/**
 * Componente de filtros com contadores
 */
export function TaskFilters({ currentFilter, onFilterChange, counts }: TaskFiltersProps) {
  const filters: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'all', label: 'Todas', count: counts.total },
    { value: 'pending', label: 'Pendentes', count: counts.pending },
    { value: 'completed', label: 'Concluídas', count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ListFilter size={18} className="text-gray-400" />
      
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${currentFilter === value
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          {label}
          <span
            className={`
              ml-1.5 px-1.5 py-0.5 rounded-full text-xs
              ${currentFilter === value
                ? 'bg-primary-200 text-primary-800'
                : 'bg-gray-200 text-gray-600'
              }
            `}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
