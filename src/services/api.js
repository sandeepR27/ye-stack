import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async (query = '', page = 1, limit = 15) => {
  try {
    const response = await axios.get(BASE_URL);
    
    if (query.trim() === '') {
      return response.data;
    }
    
    return response.data.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
