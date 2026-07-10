import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useProducts({
  page = 1,
  search = '',
  category = '',
  sort = 'newest',
}) {
  return useQuery({
    queryKey: ['products', { page, search, category, sort }],
    queryFn: async () => {
      const { data } = await api.get('/products', {
        params: {
          page,
          search,
          category,
          sort,
          limit: 12,
        },
      });

      return data;
    },
    keepPreviousData: true,
  });
}

export function useFeaturedProducts() {
  const query = useProducts({
    page: 1,
    search: '',
    category: '',
    sort: 'newest',
  });

  return {
    ...query,
    products: query.data?.products ?? query.data ?? [],
  };
}

// 👇 Add this entire function here
export function useProduct(slug) {
  const query = useQuery({
    queryKey: ['product', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data;
    },
  });

  return {
    ...query,
    product: query.data?.product ?? query.data ?? null,
  };
}