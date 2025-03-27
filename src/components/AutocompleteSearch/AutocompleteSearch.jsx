import React, { useState, useCallback } from 'react';
import { Input, List, Spin, Empty, Card, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useProductSearch } from '../../hooks/useProductSearch';
import './AutocompleteSearch.css';

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
    
    // Only open dropdown and set query if there's a value
    if (value.trim() !== '') {
      setQuery(value);
      setIsDropdownOpen(true);
      setActiveIndex(-1);
    } else {
      // Close dropdown if input is empty
      setIsDropdownOpen(false);
      setSelectedProduct(null); // Clear selected product when input is empty
    }
  }, [setQuery]);

  const handleClear = () => {
    setInputValue('');
    setSelectedProduct(null);
    setQuery('');
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setInputValue(product.title);
    setIsDropdownOpen(false);
  }, []);

const handleKeyDown = useCallback((e) => {
  switch (e.key) {
    case 'ArrowDown':
      setActiveIndex((prev) => {
        const nextIndex = Math.min(prev + 1, products.length - 1);
        scrollIntoView(nextIndex);
        return nextIndex;
      });
      break;

    case 'ArrowUp':
      setActiveIndex((prev) => {
        const prevIndex = Math.max(prev - 1, 0);
        scrollIntoView(prevIndex);
        return prevIndex;
      });
      break;

    case 'Enter':
      if (activeIndex !== -1) {
        handleSelectProduct(products[activeIndex]);
      }
      break;

    case 'Escape':
      setIsDropdownOpen(false);
      break;

    case 'Tab': // Close dropdown on Tab and allow natural focus movement
      setIsDropdownOpen(false);
      break;

    default:
      break;
  }
}, [products, activeIndex, handleSelectProduct]);

  
  const scrollIntoView = (index) => {
    const listItems = document.querySelectorAll(".dropdown-list .product-item");
    if (listItems[index]) {
      listItems[index].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };
  

  const renderProductItem = useCallback((product, index) => (
    <List.Item
      className={`product-item ${activeIndex === index ? 'active' : ''}`}
      onClick={() => handleSelectProduct(product)}
    >
      <Space className="product-space" size="small">
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-thumbnail"
        />
        <div className="product-info">
          <div className="product-title">{product.title}</div>
          <div className="product-category">{product.category}</div>
        </div>
      </Space>
    </List.Item>
  ), [activeIndex, handleSelectProduct]);

  return (
    <div className="autocomplete-container">
      <div className="search-wrapper">
        <Input
          size="middle"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // Only open dropdown if there's a value
            if (inputValue.trim() !== '') {
              setIsDropdownOpen(true);
            }
          }}
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          allowClear={{ clearIcon: <span onClick={handleClear}>×</span> }}
          className="search-input"
        />

        {isDropdownOpen && inputValue.trim() !== '' && (
          <div className="dropdown">
            {isLoading ? (
              <div className="spinner">
                <Spin />
              </div>
            ) : isError ? (
              <div className="error">
                Error fetching products
              </div>
            ) : products.length > 0 ? (
              <List
                className="dropdown-list"
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
        <Card className="product-details-card">
          <div className="product-details">
            <div className="product-image-container">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title} 
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h2 className="product-title">{selectedProduct.title}</h2>
              <p className="product-category">Category: {selectedProduct.category}</p>
              {selectedProduct.price && (
                <p className="product-price">
                  ${selectedProduct.price}
                </p>
              )}
              {selectedProduct.description && (
                <p className="product-description">{selectedProduct.description}</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AutocompleteSearch;