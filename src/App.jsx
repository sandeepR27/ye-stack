// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AutocompleteSearch from './components/AutocompleteSearch/AutocompleteSearch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      cacheTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="Home-page">
        <div className="Home-page-container">
          <h1 className="Home-page-title">
            Product Search
          </h1>
          <AutocompleteSearch />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;