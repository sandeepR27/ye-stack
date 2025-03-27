import React, { useState, useCallback, useMemo } from 'react';
import { Input, List, Spin, Empty, Card, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useProductSearch } from '../../hooks/useProductSearch';

const AutocompleteSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { 
    products, 
    isLoading, 
    isError, 
    setQuery 
  } = useProductSearch(inputValue);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    setQuery(value);
    setIsDropdownOpen(true);
    setActiveIndex(-1);
  }, [setQuery]);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setInputValue(product.title);
    setIsDropdownOpen(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    switch(e.key) {
      case 'ArrowDown':
        setActiveIndex(prev => 
          Math.min(prev + 1, products.length - 1)
        );
        break;
      case 'ArrowUp':
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (activeIndex !== -1) {
          handleSelectProduct(products[activeIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        break;
    }
  }, [products, activeIndex, handleSelectProduct]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSelectedProduct(null);
    setQuery('');
    setIsDropdownOpen(false);
  }, [setQuery]);

  const renderProductItem = useCallback((product, index) => (
    <List.Item
      className={`cursor-pointer transition-colors ${
        activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
      onClick={() => handleSelectProduct(product)}
    >
      <Space className="w-full">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-8 h-8 object-cover rounded"
        />
        <div className="flex-1">
          <div className="font-medium text-sm">{product.title}</div>
          <div className="text-xs text-gray-500">{product.category}</div>
        </div>
      </Space>
    </List.Item>
  ), [activeIndex, handleSelectProduct]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        <Input
          size="large"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search products..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          className="w-full"
        />

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
            {isLoading ? (
              <div className="p-4 text-center">
                <Spin />
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-red-500">
                Error fetching products
              </div>
            ) : products.length > 0 ? (
              <List
                className="max-h-[300px] overflow-auto"
                size="small"
                dataSource={products}
                renderItem={renderProductItem}
              />
            ) : (
              <Empty description="No products found" />
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <Card 
          className="mt-6"
          hoverable
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title} 
                className="w-full h-64 object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{selectedProduct.title}</h2>
              <p className="text-gray-600 mb-4">Category: {selectedProduct.category}</p>
              {selectedProduct.price && (
                <p className="text-xl font-bold text-blue-600">
                  ${selectedProduct.price}
                </p>
              )}
              {selectedProduct.description && (
                <p className="mt-4 text-gray-700">{selectedProduct.description}</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AutocompleteSearch;