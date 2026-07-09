import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useProducts({ page = 1, search = '', category = '', sort = 'newest' }) {
  return useQuery({
    queryKey: ['products', { page, search, category, sort }],
    queryFn: async () => {
      const { data } = await api.get('/products', {
        params: { page, search, category, sort, limit: 12 }
      });
      return data;
    },
    keepPreviousData: true
  });
}