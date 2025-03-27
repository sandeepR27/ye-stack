import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { fetchProducts } from '../services/api';

export const useProductSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products', query, page],
    queryFn: () => fetchProducts(query, page),
    keepPreviousData: true,
    staleTime: 5000,
    // Only fetch when query is not empty
    enabled: query.trim() !== ''
  });

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim() !== '' && searchQuery !== query) {
        setQuery(searchQuery);
        setPage(1);
        refetch();
      }
    }, 300),
    [query, refetch]
  );
  

   const orderedProducts = useMemo(() => {
    if (!data || data.length === 0 || !query) return [];

    const lowercaseQuery = query.toLowerCase().trim();

    // Create a scoring system for product matching
    return data
      .map(product => {
         let matchScore = 0;

         if (product.title.toLowerCase() === lowercaseQuery) {
          matchScore += 1000;
        }

         if (product.title.toLowerCase().startsWith(lowercaseQuery)) {
          matchScore += 500;
        }

         if (product.title.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 250;
        }

         if (product.category.toLowerCase().includes(lowercaseQuery)) {
          matchScore += 100;
        }

        return { ...product, matchScore };
      })
       .sort((a, b) => b.matchScore - a.matchScore)
       .map(({ matchScore, ...product }) => product);
  }, [data, query]);

  return {
    products: orderedProducts,
    isLoading: query.trim() !== '' ? isLoading : false,
    isError,
    query,
    page,
    setQuery: debouncedSearch,
    setPage
  };
};