import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function CategoryFilter({ selected, onChange }) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    }
  });

  return (
    <div>
      <h3 className="font-semibold mb-3">Categories</h3>
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <fieldset className="space-y-2">
          <legend className="sr-only">Filter by category</legend>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!selected}
              onChange={() => onChange('')}
              className="focus:ring-2 focus:ring-brand-teal/40"
            />
            <span className="text-sm">All categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selected === cat.id}
                onChange={() => onChange(cat.id)}
                className="focus:ring-2 focus:ring-brand-teal/40"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}
