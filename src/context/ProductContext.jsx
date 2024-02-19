
import React, { createContext, useState,useEffect } from 'react';

const ProductContext = createContext();
import { List } from '../data';
const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProducts(List);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProducts();
  }, [setProducts]); 

  const categories = Array.from(new Set(products.map(product => product.category)));

   const loadMoreProducts = () => {
    // Simulate fetching more products from an API or other data source
    // Append the new products to the existing product array
    // For this example, let's duplicate the existing products
    setProducts(prevProducts => [...prevProducts, ...prevProducts]);
  }; 
  return (
    <ProductContext.Provider value={{ products, setProducts ,categories , loadMoreProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
