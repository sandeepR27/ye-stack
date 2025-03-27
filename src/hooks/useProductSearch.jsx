
// src/hooks/useProductSearch.js
import { useState, useCallback } from 'react';
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
    staleTime: 5000
  });

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      setQuery(searchQuery);
      setPage(1);
      refetch();
    }, 300),
    []
  );

  return {
    products: data || [],
    isLoading,
    isError,
    query,
    page,
    setQuery: debouncedSearch,
    setPage
  };
};