// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async (query = '', page = 1, limit = 15) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { 
        search: query, 
        page, 
        limit 
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
