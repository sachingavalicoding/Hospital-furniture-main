// src/pages/ProductPage.js
import React, { useContext, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { ProductContext } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
const Products = () => {
  const { products, categories, loadMoreProducts } = useContext(ProductContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState(6);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageLoad = (event) => {
    event.target.classList.remove('filter-blur'); 
  };

  const loadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 6);
  };

  return (
    <div className="container mx-auto my-8">
      <div className=" flex flex-col gap-6  md:flex justify-between items-center mb-6">
        <div className=" flex w-screen px-20 md:flex items-center ">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 w-full rounded-md"
          />
          <button className="ml-2 bg-gray-200 p-2 rounded-md">
            <IoMdSearch />
          </button>
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.slice(0, visibleProducts).map(product => (
          <div key={product.id} className="bg-white px-6 relative top-0 flex flex-col justify-between gap-2 p-4  rounded-md shadow-md">
            <img src={product.image} alt={product.title} className="mb-4 rounded-md" loading='lazy' onLoad={handleImageLoad} />
          <div className='text-center flex flex-col gap-2'>
          <h3 className=" font-bold text-xs">{product.title}</h3>
            {/* <p className="text-gray-500">{product.description}</p> */}
            {/* <p className="text-lg font-bold mt-2">${product.price}</p> */}
            {/* Pass 4 images as URL parameters */}
            <Link
              to={`/products/${product.id}?img=${product.image}`}
              className="bg-blue-900 text-white px-4 py-2 text-center rounded-md hover:text-slate-200 hover:bg-blue-700" 
            >
              Read More
            </Link>
            <div className='flex items-center justify-center w-12 h-12 rounded-full absolute top-0 right-1 bg-slate-50'>
              <p> {product.productNo} </p>
            </div>
          </div>
          </div>
        ))}
      </div>

      {visibleProducts < filteredProducts.length && (
        <div className="text-center mt-6">
          <button onClick={loadMore} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Check More
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
