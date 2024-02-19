// src/components/ProductPreview.js
import React, { useContext } from 'react';
import { useParams , Link } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';

const ProductPreview = () => {
  const { products } = useContext(ProductContext);
  const { id } = useParams();

  const img = new URLSearchParams(window.location.search).get('img');

  const product = products.find(product => product.id === parseInt(id, 10));

  if (!product) {
    return <p>Product not found</p>;
  }

  const { title, description, price } = product;

  return (
    <div className="container mx-auto my-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="col-span-2 lg:col-span-1">
        <img src={img} alt={title} className="mb-4 rounded-md w-full" />
      </div>

      <div className="col-span-2 lg:col-span-2 px-5">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <Link to={"/contact"}>
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">Contact with me </button></Link>
      </div>
    </div>
  </div>
  );
};

export default ProductPreview;
