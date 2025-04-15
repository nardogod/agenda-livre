import React from 'react';
import FilterGroup from './FilterGroup';

type Category = {
  id: string;
  name: string;
};

const categories: Category[] = [
  { id: 'braids', name: 'Tranças' },
  { id: 'haircuts', name: 'Cortes' },
  { id: 'hair_treatment', name: 'Tratamentos' },
  { id: 'manicure', name: 'Manicure' },
  { id: 'makeup', name: 'Maquiagem' },
  { id: 'styling', name: 'Penteados' },
  { id: 'barber', name: 'Barbearia' },
  { id: 'extensions', name: 'Alongamentos' },
];

type CategoryFilterProps = {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  expanded?: boolean;
  className?: string;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onChange,
  expanded = false,
  className = '',
}) => {
  const handleToggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <FilterGroup 
      title="Categorias" 
      expanded={expanded} 
      badge={selectedCategories.length}
      className={className}
    >
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleToggleCategory(category.id)}
              className="h-4 w-4 text-primary border-gray-medium rounded"
            />
            <label 
              htmlFor={`category-${category.id}`} 
              className="ml-2 text-sm text-gray-text cursor-pointer"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
      
      {selectedCategories.length > 0 && (
        <button
          type="button"
          className="mt-3 text-xs text-primary font-medium"
          onClick={() => onChange([])}
        >
          Limpar filtros
        </button>
      )}
    </FilterGroup>
  );
};

export default CategoryFilter;